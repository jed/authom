var OAuth2 = require("./oauth2")
  , util = require("util")

function Reddit(options) {
  this.code = {
    protocol: "https",
    host: "ssl.reddit.com",
    pathname: "/api/v1/authorize",
    query: {
      client_id: options.id,
      response_type: "code",
      state: options.state,
      duration: options.duration || "temporary"
    }
  }

  this.token = {
    method: "POST",
    host: "ssl.reddit.com",
    path: "/api/v1/access_token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization" : "Basic " + new Buffer(options.id + ":" + options.secret).toString("base64")
    },
    query: {
      grant_type: "authorization_code"
    }
  }

  this.user = {
    host: "oauth.reddit.com",
    path: "/api/v1/me",
    query: {}
  }
  
  this.code.query.scope = options.scope ? options.scope.join(",") : "identity";

  this.on("request", this.onRequest.bind(this))

  OAuth2.call(this)
}

util.inherits(Reddit, OAuth2)

module.exports = Reddit
