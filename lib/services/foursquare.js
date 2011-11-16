var OAuth2 = require("./oauth2")
  , url = require("url")

function Foursquare(options) {
  ["code", "token", "user"].forEach(function(name) {
    this[name] = Object.create(this[name])
  }, this)

  this.code.query = {
    client_id: options.id,
    response_type: 'code',
    scope: options.scope || []
  }

  this.token.query = {
    client_id: options.id,
    client_secret: options.secret,
    grant_type: "authorization_code"
  }

  this.user.query = {
    v: "20111116"
  }

  this.on("request", this.onRequest.bind(this))
}

Foursquare.prototype = new OAuth2

Foursquare.prototype.code = {
  protocol: "https",
  host: "foursquare.com",
  pathname: "/oauth2/authenticate"
}

Foursquare.prototype.token = {
  host: "foursquare.com",
  path: "/oauth2/access_token"
}

Foursquare.prototype.user = {
  host: "api.foursquare.com",
  path: "/v2/users/self",
  tokenKey: "oauth_token"
}

module.exports = Foursquare