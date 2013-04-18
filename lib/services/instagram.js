var OAuth2 = require("./oauth2")
, util = require('util')

function Instagram(options) {
  ["code", "token", "user"].forEach(function(name) {
    this[name] = Object.create(this[name])
  }, this)

  this.code.query = {
    response_type: "code",
    client_id: options.id,
    scope: options.scope || []
  }

  this.token.query = {
    client_id: options.id,
    client_secret: options.secret,
    grant_type: "authorization_code"
  }

  this.user.query = {}

  this.on("request", this.onRequest.bind(this))

  OAuth2.call(this)
}

util.inherits(Instagram, OAuth2)

Instagram.prototype.code = {
  protocol: "https",
  host: "api.instagram.com",
  pathname: "/oauth/authorize/"
}

Instagram.prototype.token = {
  method: "POST",
  host: "api.instagram.com",
  path: "/oauth/access_token",
  headers: { "Content-Type": "application/x-www-form-urlencoded" }
}

Instagram.prototype.user = {
  host: "api.instagram.com",
  path: "/v1/users/self"
}

Instagram.prototype.getId = function(data) {
  return data.data.id
}

module.exports = Instagram