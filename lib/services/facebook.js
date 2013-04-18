var OAuth2 = require("./oauth2")
  , util = require('util');

function Facebook(options) {
  this.code.query = {
    client_id: options.id
  }

  this.token.query = {
    client_id: options.id,
    client_secret: options.secret
  }

  this.user.query = {}

  if(options.scope) {
    this.code.query.scope = options.scope.join(',')
  }

  if(options.fields) {
    this.user.query.fields = options.fields.join( ',' )
  }

  this.on("request", this.onRequest.bind(this))
  
  OAuth2.call(this);
}

util.inherits(Facebook, OAuth2);

Facebook.prototype.code = {
  protocol: "https",
  host: "www.facebook.com",
  pathname: "/dialog/oauth"
}

Facebook.prototype.token = {
  method: "POST",
  host: "graph.facebook.com",
  path: "/oauth/access_token",
  headers: { "Content-Type": "application/x-www-form-urlencoded" }
}

Facebook.prototype.user = {
  host: "graph.facebook.com",
  path: "/me"
}

module.exports = Facebook