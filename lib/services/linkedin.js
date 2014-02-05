var EventEmitter = require("events").EventEmitter
  , util = require("util")
  , url = require("url")
  , OAuth
  , secrets = {}

try { OAuth = require("oauth").OAuth }
catch (e) {
  throw new Error("oauth library could not be loaded.")
}

function LinkedIn(options) {
  this.id = options.id
  this.secret = options.secret
  this.scopes = options.scopes || ["r_basicprofile"]
  this.format = options.format || "json"
  this.fields = options.fields || ["first-name","last-name","picture-url","industry","summary","specialties","skills","projects","headline","site-standard-profile-request"]
  
  this.dataUrl = "http://api.linkedin.com/v1/people/~:(id,"+ this.fields.join(",") +")?format=" + this.format 
  
  this.on("request", this.onRequest.bind(this))

  EventEmitter.call(this)
}

util.inherits(LinkedIn, EventEmitter)

LinkedIn.prototype.parseURI = function(request) {
  var protocol = request.socket.encrypted ? "https" : "http"
    , host = request.headers.host || request.connection.remoteAddress

  return url.parse(protocol + "://" + host + request.url, true)
}

LinkedIn.prototype.onRequest = function(req, res) {
  var self = this
    , uri = this.parseURI(req)
    , verifier = uri.query.oauth_verifier
    , token = uri.query.oauth_token
    , oa = new OAuth(
        "https://api.linkedin.com/uas/oauth/requestToken" + "?scope=" + this.scopes.join("+"),
        "https://api.linkedin.com/uas/oauth/accessToken",
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
      Location: "https://www.linkedin.com/uas/oauth/authenticate?oauth_token=" + oauth_token
    })

    res.end()
  })
  

  function onToken(error, oauth_access_token, oauth_access_token_secret, results){
    if (error) return self.emit("error", req, res, uri.query, error)
    
    oa.getProtectedResource(
      self.dataUrl, 
      "GET", 
      oauth_access_token, 
      oauth_access_token_secret,
      function (error, data, response) {
        var feed = JSON.parse(data);
        self.emit("auth", req, res, {
          token: oauth_access_token,
          secret: oauth_access_token_secret,
          id: feed.id,
          data: feed
        });
      });
  }
}

module.exports = LinkedIn
