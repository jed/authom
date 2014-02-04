var OAuth2 = require("./oauth2")
  , util = require("util")
  , url = require("url")

function Foursquare(options) {
  this.code = {
    protocol: "https",
    host: "foursquare.com",
    pathname: "/oauth2/authenticate",
    query: {
      client_id: options.id,
      response_type: "code",
      scope: options.scope || []
    }
  }

  this.token = {
    host: "foursquare.com",
    path: "/oauth2/access_token",
    query: {
      client_id: options.id,
      client_secret: options.secret,
      grant_type: "authorization_code"
    }
  }

  this.user = {
    host: "api.foursquare.com",
    path: "/v2/users/self",
    tokenKey: "oauth_token",
    query: {
      v: "20111116"
    }
  }

  this.on("request", this.onRequest.bind(this))

  OAuth2.call(this)
}

util.inherits(Foursquare, OAuth2)

Foursquare.prototype.getId = function(data) {
  return data.response.user.id
}

module.exports = Foursquare
