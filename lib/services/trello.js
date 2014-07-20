var EventEmitter = require("events").EventEmitter
  , util = require("util")
  , url = require("url")
  , OAuth
  , secrets = {}

try { OAuth = require("oauth").OAuth }
catch (e) {
  throw new Error("oauth library could not be loaded.")
}

function Trello(options) {
  this.id = options.id
  this.secret = options.secret
  this.name = options.app_name
  this.expiration = options.expiration || '30days'
  this.scope = options.scope || 'read'

  this.on("request", this.onRequest.bind(this))

  EventEmitter.call(this);
}

util.inherits(Trello, EventEmitter);

Trello.prototype.parseURI = function(request) {
  var protocol = request.socket.encrypted ? "https" : "http"
    , host = request.headers.host || request.connection.remoteAddress

  return url.parse(protocol + "://" + host + request.url, true)
}

Trello.prototype.onRequest = function(req, res) {
  var self = this
    , uri = this.parseURI(req)
    , verifier = uri.query.oauth_verifier
    , token = uri.query.oauth_token
    , oa = new OAuth(
        "https://trello.com/1/OAuthGetRequestToken",
        "https://trello.com/1/OAuthGetAccessToken",
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

    var redirect_url = "https://trello.com/1/OAuthAuthorizeToken?oauth_token=" + oauth_token
      , params = ['scope', 'expiration', 'name']

    for (var k in params) {
      var opt = params[k]
      if (self[opt] !== undefined)
        redirect_url += ['&', opt , '=' , self[opt] ].join('')
    }

    res.writeHead(302, {
      Location: redirect_url
    })

    res.end()
  })

  function onToken(error, oauth_access_token, oauth_access_token_secret, results){
    if (error) return self.emit("error", req, res, uri.query, error)

    self.emit("auth", req, res, {
      token: oauth_access_token,
      secret: oauth_access_token_secret,
      id: results.encoded_user_id,
      data: results
    })
  }
}

module.exports = Trello
