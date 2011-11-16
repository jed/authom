var OAuth2 = require("./oauth2")

function Github(options) {
  ["code", "token", "user"].forEach(function(name) {
    this[name] = Object.create(this[name])
  }, this)

  this.code.query = {
    client_id: options.id,
    scope: options.scope || []
  }

  this.token.query = {
    client_id: options.id,
    client_secret: options.secret
  }

  this.user.query = {}

  this.on("request", this.onRequest.bind(this))
}

Github.prototype = new OAuth2

Github.prototype.code = {
  protocol: "https",
  host: "github.com",
  pathname: "/login/oauth/authorize"
}

Github.prototype.token = {
  method: "POST",
  host:   "github.com",
  path:   "/login/oauth/access_token"
}

Github.prototype.user = {
  host: "api.github.com",
  path: "/user"
}

module.exports = Github