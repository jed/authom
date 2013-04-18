var OAuth2 = require("./oauth2")
  , util = require('util')

function Meetup(options) {
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

  OAuth2.call(this)
}

util.inherits(Meetup, OAuth2)

Meetup.prototype.code = {
  protocol: "https",
  host: "secure.meetup.com",
  pathname: "/oauth2/authorize"
}

Meetup.prototype.token = {
  method: "POST",
  host: "secure.meetup.com",
  path: "/oauth2/access",
  headers: { "Content-Type": "application/x-www-form-urlencoded" }
}

Meetup.prototype.user = {
  host: "api.meetup.com",
  path: "/2/member/self"
}

module.exports = Meetup