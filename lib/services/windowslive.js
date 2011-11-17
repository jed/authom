var OAuth2 = require("./oauth2")

function WindowsLive(options) {
  ["code", "token", "user"].forEach(function(name) {
    this[name] = Object.create(this[name])
  }, this)

  this.code.query = {
    client_id: options.id,
    response_type: "code",
    scope: options.scope
  }

  this.token.query = {
    client_id: options.id,
    client_secret: options.secret,
    grant_type: "authorization_code"
  }

  this.user.query = {}

  this.on("request", this.onRequest.bind(this))
}

WindowsLive.prototype = new OAuth2

WindowsLive.prototype.code = {
  protocol: "https",
  host: "oauth.live.com",
  pathname: "/authorize"
}

WindowsLive.prototype.token = {
  method: "POST",
  host: "oauth.live.com",
  path: "/token",
  headers: { "Content-Type": "application/x-www-form-urlencoded" }
}

WindowsLive.prototype.user = {
  host: "apis.live.net",
  path: "/v5.0/me"
}

module.exports = WindowsLive