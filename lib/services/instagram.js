var OAuth2 = require("./oauth2")
, util = require("util")

function Instagram(options) {
  this.code = {
    protocol: "https",
    host: "api.instagram.com",
    pathname: "/oauth/authorize/",
    query: {
      response_type: "code",
      client_id: options.id,
      scope: options.scope || []
    }
  }

  this.token = {
    method: "POST",
    host: "api.instagram.com",
    path: "/oauth/access_token",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    query: {
      client_id: options.id,
      client_secret: options.secret,
      grant_type: "authorization_code"
    }
  }

  this.user = {
    host: "api.instagram.com",
    path: "/v1/users/self",
    query: {}
  }

  this.on("request", this.onRequest.bind(this))

  OAuth2.call(this)
}

util.inherits(Instagram, OAuth2)

Instagram.prototype.getId = function(data) {
  return data.data.id
}

module.exports = Instagram
