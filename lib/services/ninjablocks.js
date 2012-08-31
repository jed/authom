var OAuth2 = require("./oauth2")

function NinjaBlocks(options) {
  ["code", "token", "user"].forEach(function(name) {
    this[name] = Object.create(this[name])
  }, this)

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
}

NinjaBlocks.prototype = new OAuth2

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