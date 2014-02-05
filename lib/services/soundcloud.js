var OAuth2 = require("./oauth2")
  , util = require("util")

function SoundCloud(options) {
  this.code = {
    protocol: "https",
    host: "soundcloud.com",
    pathname: "/connect",
    query: {
      client_id: options.id,
      scope: "non-expiring",
      response_type: "code"
    }
  }

  this.token = {
    method: "POST",
    host: "api.soundcloud.com",
    path: "/oauth2/token",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    query: {
      client_id: options.id,
      client_secret: options.secret,
      grant_type: "authorization_code"
    }
  }


  this.user = {
    host: "api.soundcloud.com",
    path: "/me.json",
    tokenKey: "oauth_token",
    query: {}
  }

  this.on("request", this.onRequest.bind(this))

  OAuth2.call(this)
}

util.inherits(SoundCloud, OAuth2)

module.exports = SoundCloud
