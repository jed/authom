var OAuth2 = require("./oauth2")
  , util = require("util")

function vso(options) {
  this.code.query = {
      client_id: options.id,
      response_type: "Assertion",
      scope: options.scope
  }

  this.token.query = {
      client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      client_assertion: options.secret,
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: ""
  }

  this.user.query = {}

  this.on("request", this.onRequest.bind(this))

  OAuth2.call(this, options)
}

util.inherits(vso, OAuth2)

vso.prototype.code = {
    protocol: "https",
    host: "app.vssps.visualstudio.com",
    pathname: "/oauth2/authorize"
}

vso.prototype.token = {
    method: "POST",
    host: "app.vssps.visualstudio.com",
    path: "/oauth2/token",
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
}

vso.prototype.user = {
    host: "app.vssps.visualstudio.com",
    path: "/_apis/profile/profiles/me?api-version=1.0"
}
module.exports = vso
