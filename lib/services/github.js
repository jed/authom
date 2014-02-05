var OAuth2 = require("./oauth2")
  , util = require("util")

function Github(options) {
  this.code = {
    protocol: "https",
    host: "github.com",
    pathname: "/login/oauth/authorize",
    query: {
      client_id: options.id,
      redirect_uri: options.redirect_uri,
      scope: options.scope,
      state: options.state
    }
  }

  this.token = {
    method: "POST",
    host:   "github.com",
    path:   "/login/oauth/access_token",
    query: {
      client_id: options.id,
      client_secret: options.secret
    }
  }

  this.user = {
    host: "api.github.com",
    path: "/user",
    query: {}
  }

  this.on("request", this.onRequest.bind(this))

  OAuth2.call(this);
}

util.inherits(Github, OAuth2)

module.exports = Github
