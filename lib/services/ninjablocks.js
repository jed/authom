var OAuth2 = require("./oauth2")
  , util = require('util')

function NinjaBlocks(options) {

  this.code.query = {
    client_id: options.id,
    response_type: "code",
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

util.inherits(NinjaBlocks, OAuth2)

NinjaBlocks.prototype.code = {
  protocol: "https",
  host: "api.ninja.is",
  pathname: "/oauth/authorize"
}

NinjaBlocks.prototype.token = {
  method: "POST",
  host: "api.ninja.is",
  path: "/oauth/access_token"
}

NinjaBlocks.prototype.user = {
  host: "api.ninja.is",
  path: "/rest/v1/user"
}

module.exports = NinjaBlocks