var OAuth2 = require("./oauth2")
  , url = require("url")

function Foursquare(options) {
  ["code", "token", "user"].forEach(function(name) {
    this[name] = Object.create(this[name])
  }, this)

  this.code.query = {
    client_id: options.id,
    response_type: 'code',
    scope: options.scope || []
  }

  this.token.query = {
    client_id: options.id,
    client_secret: options.secret,
    grant_type: "authorization_code"
  }

  this.user.query = {
    v: "20111116"
  }

  this.on("request", this.onRequest.bind(this))
}

Foursquare.prototype = new OAuth2

// had to override this as 4sq uses "oauth_" instead of "access_"
Foursquare.prototype.onCode = function(req, res) {
  this.token.query.code = req.url.query.code

  delete req.url.query.code
  delete req.url.search

  this.token.query.redirect_uri = url.format(req.url)

  this.request(this.token, function(err, data) {
    if (err) return this.emit("error", req, res, err)

    this.user.query.oauth_token = data.access_token

    this.request(this.user, function(err, user) {
      if (err) return this.emit("error", req, res, err)

      user.token = data.access_token

      this.emit("auth", req, res, user.response.user)
    }.bind(this))
  }.bind(this))
}

Foursquare.prototype.code = {
  protocol: "https",
  host: "foursquare.com",
  pathname: "/oauth2/authenticate"
}

Foursquare.prototype.token = {
  host: "foursquare.com",
  path: "/oauth2/access_token"
}

Foursquare.prototype.user = {
  host: "api.foursquare.com",
  path: "/v2/users/self"
}

module.exports = Foursquare