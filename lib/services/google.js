var OAuth2 = require("./oauth2")
  , util = require("util")

function Google(options) {
  this.code = {
    protocol: "https",
    host: "accounts.google.com",
    pathname: "/o/oauth2/auth",
    query: {
      response_type: "code",
      client_id: options.id,
      scope: (options.scope || ["https://www.googleapis.com/auth/userinfo.profile"]).join(" "),
      access_type: "offline",
      approval_prompt: "auto"
    }
  }

  this.token = {
    method: "POST",
    host: "accounts.google.com",
    path: "/o/oauth2/token",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    query: {
      client_id: options.id,
      client_secret: options.secret,
      grant_type: "authorization_code"
    }
  }

  this.user = {
    host: "www.googleapis.com",
    path: "/oauth2/v1/userinfo",
    query: {}
  }

  this.on("request", this.onRequest.bind(this))

  OAuth2.call(this)
}

util.inherits(Google, OAuth2)

module.exports = Google
