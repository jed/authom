var OAuth2 = require("./oauth2")
  , util = require('util')
  
function Google(options) {
  this.code.query = {
    response_type: "code",
    client_id: options.id,
    scope: (options.scope || ["https://www.googleapis.com/auth/userinfo.profile"]).join(" "),
    access_type: "offline",
    approval_prompt: "auto"
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

util.inherits(Google, OAuth2)

Google.prototype.code = {
  protocol: "https",
  host: "accounts.google.com",
  pathname: "/o/oauth2/auth"
}

Google.prototype.token = {
  method: "POST",
  host: "accounts.google.com",
  path: "/o/oauth2/token",
  headers: { "Content-Type": "application/x-www-form-urlencoded" }
}

Google.prototype.user = {
  host: "www.googleapis.com",
  path: "/oauth2/v1/userinfo"
}

module.exports = Google
