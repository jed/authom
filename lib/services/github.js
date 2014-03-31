var OAuth2 = require("./oauth2")
  , util = require("util")
  , url = require("url")

function Github(options) {
  var urlObj = url.parse(options.url || 'https://github.com');
  var protocol = urlObj.protocol.slice(0, urlObj.protocol.length-1); // We don't want the colon
  // Different handling for github.com and GitHub Enterprise
  var apiHost = urlObj.host == 'github.com' ? 'api.github.com' : urlObj.host;
  var apiPrefix = urlObj.host == 'github.com' ? '' : '/api/v3';

  this.code = {
    protocol: protocol,
    host: urlObj.host,
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
    protocol: protocol,
    host: urlObj.host,
    path: "/login/oauth/access_token",
    query: {
      client_id: options.id,
      client_secret: options.secret
    }
  }

  this.user = {
    host: apiHost,
    path: apiPrefix + "/user",
    query: {}
  }

  this.on("request", this.onRequest.bind(this))

  OAuth2.call(this);
}

util.inherits(Github, OAuth2)

module.exports = Github
