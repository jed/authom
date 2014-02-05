var EventEmitter = require("events").EventEmitter
  , util = require("util")
  , url = require("url")
  , OAuth
  , secrets = {}

try { OAuth = require("oauth").OAuth }
catch (e) {
  throw new Error("oauth library could not be loaded.")
}

function Bitbucket(options) {
  this.id = options.id
  this.secret = options.secret
  this.emails = options.emails

  this.on("request", this.onRequest.bind(this))

  this.userUrl = "https://api.bitbucket.org/1.0/user"

  EventEmitter.call(this);
}

util.inherits(Bitbucket, EventEmitter);

Bitbucket.prototype.parseURI = function(request) {
  var protocol = request.socket.encrypted ? "https" : "http"
    , host = request.headers.host || request.connection.remoteAddress

  return url.parse(protocol + "://" + host + request.url, true)
}

Bitbucket.prototype.getReturnCall = function(request) {
  var protocol = request.socket.encrypted ? "https" : "http"
    , host = request.headers.host || request.connection.remoteAddress

  return protocol + "://" + host + request.url;
}

Bitbucket.prototype.onRequest = function(req, res) {
  var self = this
    , uri = this.parseURI(req)
    , verifier = uri.query.oauth_verifier
    , token = uri.query.oauth_token
    , return_path = this.getReturnCall(req)
    , oa = new OAuth(
        "https://bitbucket.org/!api/1.0/oauth/request_token",
        "https://bitbucket.org/!api/1.0/oauth/access_token",
        this.id,
        this.secret,
        "1.0",
        url.format(uri),
        "HMAC-SHA1"
      )

  if (verifier && token) {
    oa.getOAuthAccessToken(token, secrets[token], verifier, onToken)
  }

  else oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
    if (error) return self.emit("error", req, res, uri.query, error)

    secrets[oauth_token] = oauth_token_secret
    setTimeout(function(){ delete secrets[oauth_token] }, 60000)

    res.writeHead(302, {
      Location: "https://bitbucket.org/!api/1.0/oauth/authenticate?oauth_token=" + oauth_token+"&oauth_callback="+return_path
    })

    res.end()
  })

  function onToken(error, oauth_access_token, oauth_access_token_secret, results){
    if (error) return self.emit("error", req, res, uri.query, error)

    oa.getProtectedResource(
      self.userUrl, 
      "GET", 
      oauth_access_token, 
      oauth_access_token_secret,
      function (error, data, response) {
        if (error) return self.emit("error", req, res, uri.query, error)
        var feed = JSON.parse(data);
        var authData = {
          token: oauth_access_token,
          secret: oauth_access_token_secret,
          id: feed.user.username,
          data: feed
        }

        if(self.emails) {
          var emails_url = "https://bitbucket.org/api" + feed.user.resource_uri + "/emails"
          oa.getProtectedResource(
            emails_url,
            "GET",
            oauth_access_token,
            oauth_access_token_secret,
            function (error, data, response) {
              if (error) return self.emit("error", req, res, uri.query, error)
              authData.data.emails = JSON.parse(data);
              self.emit("auth", req, res, authData)
            }
          )
        } else {
          self.emit("auth", req, res, authData)
        }
      }
    )
  }
}

module.exports = Bitbucket
