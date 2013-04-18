var OAuth2 = require("./oauth2")
  , util = require('util')
  
function Gowalla(options) {
  this.code.query = {
    response_type: "code",
    client_id: options.id
  }

  this.token.query = {
    client_id: options.id,
    client_secret: options.secret,
    grant_type: "authorization_code"
  }

  this.user.query = {}
  this.user.headers["X-Gowalla-API-Key"] = options.id

  this.on("request", this.onRequest.bind(this))

  OAuth2.call(this)
}

util.inherits(Gowalla, OAuth2)

Gowalla.prototype.code = {
  protocol: "https",
  host: "gowalla.com",
  pathname: "/api/oauth/new"
}

Gowalla.prototype.token = {
  method: "POST",
  host: "api.gowalla.com",
  path: "/api/oauth/token"
}

Gowalla.prototype.user = {
  host: "api.gowalla.com",
  headers: { "Accept": "application/json" },
  path: "/users/me",
  tokenKey: "oauth_token"
}

Gowalla.prototype.getId = function(data) {
  return data.url.match(/\d+/)[0]
}

module.exports = Gowalla