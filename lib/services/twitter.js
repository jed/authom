var EventEmitter = require("events").EventEmitter
  , util = require('util')
  , url = require("url")
  , OAuth
  , secrets = {}

try { 
  OAuth = require("oauth").OAuth 
} catch (e) {
  throw new Error("oauth library could not be loaded.")
}

function Twitter(options) {
  this.id = options.id
  this.secret = options.secret

  this.on("request", this.onRequest.bind(this))

  EventEmitter.call(this);
}

util.inherits(Twitter, EventEmitter);

Twitter.prototype.parseURI = function(request) {
  var proto = (request.headers["x-forwarded-proto"] || "").toLowerCase()
    , protocol = request.socket.encrypted || proto == 'https' ? "https" : "http"
    , host = request.headers.host || request.connection.remoteAddress

  return url.parse(protocol + "://" + host + request.url, true)
}

Twitter.prototype.onRequest = function(req, res) {
  var self = this
    , uri = this.parseURI(req)
    , verifier = uri.query.oauth_verifier
    , token = uri.query.oauth_token
    , oa = new OAuth(
        "https://api.twitter.com/oauth/request_token",
        "https://api.twitter.com/oauth/access_token",
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
    if (error) return self.emit("error", req, res, uri.query)

    secrets[oauth_token] = oauth_token_secret
    setTimeout(function(){ delete secrets[oauth_token] }, 60000)

    res.writeHead(302, {
      Location: "https://twitter.com/oauth/authenticate?oauth_token=" + oauth_token
    })

    res.end()
  })

  function onToken(error, oauth_access_token, oauth_access_token_secret, results){
    if (error) return self.emit("error", req, res, uri.query)

    self.emit("auth", req, res, {
      token: oauth_access_token,
      secret: oauth_access_token_secret,
      id: results.user_id,
      data: results
    })
  }
}

module.exports = Twitter
