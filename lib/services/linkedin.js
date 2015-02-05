var OAuth2 = require("./oauth2")
  , util = require("util")

function LinkedIn2(options) {
  var url = require('url').parse(options.url || 'https://www.linkedin.com')
  var protocol = url.protocol.split(':')[0];
  var apiPath = ''
  var scope = options.scopes || ["r_basicprofile"];
  var fields = options.fields || ["first-name","last-name","picture-url","industry","summary","specialties","skills","projects","headline","site-standard-profile-request"]

  this.code = {
    protocol: protocol,
    host: url.host,
    pathname: "/uas/oauth2/authorization",
    query: {
      client_id: options.id,
      redirect_uri: options.redirect_uri,
      scope: scope.join(' '),
      state: options.state || +new Date,
      response_type: 'code'
    }
  }

  this.token = {
    method: "POST",
    host:   url.host,
    path:   '/uas/oauth2/accessToken',
    query: {
      client_id: options.id,
      client_secret: options.secret,
      grant_type: 'authorization_code'
    }
  }

  this.user = {
    host: 'api.linkedin.com',
    path:   '/v1/people/~:(id,'+ fields.join(",") +')',
    tokenKey: 'oauth2_access_token',
    query: {
      format: 'json'
    }
  }

  this.on("request", this.onRequest.bind(this))

  OAuth2.call(this, options);
}

util.inherits(LinkedIn2, OAuth2)

module.exports = LinkedIn2;
