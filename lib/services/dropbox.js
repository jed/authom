var EventEmitter = require("events").EventEmitter
  , util = require("util")
  , url = require("url")
  , OAuth
  , secrets = {}

try { OAuth = require("oauth").OAuth }
catch (e) {
  throw new Error("oauth library could not be loaded.")
}

function Dropbox(options) {
  this.id = options.id
  this.secret = options.secret
  this.info = options.info

  this.on("request", this.onRequest.bind(this))

  this.infoUrl = "https://api.dropbox.com/1/account/info"
  
  EventEmitter.call(this);
}

util.inherits(Dropbox, EventEmitter);

Dropbox.prototype.parseURI = function(request) {
  var protocol = request.socket.encrypted ? "https" : "http"
    , host = request.headers.host || request.connection.remoteAddress

  return url.parse(protocol + "://" + host + request.url, true)
}

Dropbox.prototype.getReturnCall = function(request) {
  var protocol = request.socket.encrypted ? "https" : "http"
    , host = request.headers.host || request.connection.remoteAddress

  return protocol + "://" + host + request.url;
}

Dropbox.prototype.onRequest = function(req, res) {
  var self = this
    , uri = this.parseURI(req)
    , verifier = uri.query.uid
    , token = uri.query.oauth_token
    , return_path = this.getReturnCall(req)
    , oa = new OAuth(
        "https://api.dropbox.com/1/oauth/request_token",
        "https://api.dropbox.com/1/oauth/access_token",
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
      Location: "https://www.dropbox.com/1/oauth/authorize?oauth_token=" + oauth_token+"&oauth_callback="+return_path
    })

    res.end()
  })

  function onToken(error, oauth_access_token, oauth_access_token_secret, results){
    if (error) return self.emit("error", req, res, uri.query, error)

    if(self.info) {
      oa.getProtectedResource(
        self.infoUrl,
        "GET",
        oauth_access_token,
        oauth_access_token_secret,
        function (error, data, response) {
          var feed = JSON.parse(data);
          self.emit("auth", req, res, {
            token: oauth_access_token,
            secret: oauth_access_token_secret,
            id: results.uid,
            data: feed
          })
        }
      )
    } else {
      self.emit("auth", req, res, {
        token: oauth_access_token,
        secret: oauth_access_token_secret,
        id: results.uid,
        data: results
      })
    }
  }
}

module.exports = Dropbox
