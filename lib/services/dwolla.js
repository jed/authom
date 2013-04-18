var OAuth2 = require("./oauth2")
  , util = require('util');

function Dwolla(options) {
  this.code.query = {
    response_type: "code",
    client_id: options.id,
    scope: options.scope    
  }

  this.token.query = {
    client_id: options.id,
    client_secret: options.secret,
    grant_type: "authorization_code"
  }

  this.user.query = {}

  this.on("request", this.onRequest.bind(this))
  
  OAuth2.call(this);
}

util.inherits(Dwolla, OAuth2);

Dwolla.prototype.code = {
  protocol: "https",
  host: "www.dwolla.com",
  pathname: "/oauth/v2/authenticate"
}



Dwolla.prototype.token = {
  method: "POST",
  host: "www.dwolla.com",
  path: "/oauth/v2/token",
  headers: { "Content-Type": "application/x-www-form-urlencoded" }
  
}

Dwolla.prototype.user = {
  host: "www.dwolla.com",
  headers: { "Accept": "application/json" },
  path: "/oauth/rest/accountapi/accountinformation",
  tokenKey: "oauth_token"
}

Dwolla.prototype.getId = function(data) {
  return data.Id
}

module.exports = Dwolla