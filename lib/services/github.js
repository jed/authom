var OAuth2 = require("./oauth2")
  , util = require("util")

function Github(options) {
  var url = require('url').parse(options.url || 'https://github.com')
  var protocol = url.protocol.split(':')[0]
  var apiHost = url.host === 'github.com' ? 'api.github.com' : url.host
  var apiPath = url.host === 'github.com' ? '' : '/api/v3'

  this.code = {
    protocol: protocol,
    host: url.host,
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
    host:   url.host,
    path:   "/login/oauth/access_token",
    query: {
      client_id: options.id,
      client_secret: options.secret
    }
  }

  this.user = {
    host: apiHost,
    path: apiPath + "/user",
    query: {}
  }

  this.on("request", this.onRequest.bind(this))

  OAuth2.call(this, options);
}

util.inherits(Github, OAuth2)

module.exports = Github
