var OAuth2 = require("./oauth2")

function Facebook(options) {
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

Facebook.prototype = new OAuth2

Facebook.prototype.code = {
  protocol: "https",
  host: "www.facebook.com",
  pathname: "/dialog/oauth"
}

Facebook.prototype.token = {
  method: "POST",
  host: "graph.facebook.com",
  path: "/oauth/access_token",
  headers: { "Content-Type": "application/x-www-form-urlencoded" }
}

Facebook.prototype.user = {
  host: "graph.facebook.com",
  path: "/me"
}

module.exports = Facebook