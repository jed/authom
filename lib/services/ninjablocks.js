var OAuth2 = require("./oauth2")
  , util = require("util")

function NinjaBlocks(options) {
  this.code = {
    protocol: "https",
    host: "api.ninja.is",
    pathname: "/oauth/authorize",
    query: {
      client_id: options.id,
      response_type: "code",
      scope: options.scope || []
    }
  }

  this.token = {
    method: "POST",
    host: "api.ninja.is",
    path: "/oauth/access_token",
    query: {
      client_id: options.id,
      client_secret: options.secret,
      grant_type: "authorization_code"
    }
  }

  this.user = {
    host: "api.ninja.is",
    path: "/rest/v1/user",
    query: {}
  }

  this.on("request", this.onRequest.bind(this))

  OAuth2.call(this)
}

util.inherits(NinjaBlocks, OAuth2)

module.exports = NinjaBlocks
