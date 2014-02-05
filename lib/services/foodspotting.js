var OAuth2 = require("./oauth2")
  , util = require("util");

// OAuth2 spec 10
function Foodspotting(options) {
  this.code = {
    protocol: "https",
    host: "www.foodspotting.com",
    pathname: "/oauth/authorize",
    query: {
      client_id: options.id,
      scope: options.scope || [],
      response_type: "code"
    }
  }

  this.token = {
    method: "POST",
    host: "www.foodspotting.com",
    path:   "/oauth/token",
    query: {
      client_id: options.id,
      client_secret: options.secret,
      grant_type: "authorization_code"
    }
  }

  this.user = {
    host: "www.foodspotting.com",
    path: "/api/v1/people/current.json",
    tokenKey: "oauth_token",
    query: {
      api_key: options.id
    }
  }

  this.on("request", this.onRequest.bind(this));

  OAuth2.call(this);
}

util.inherits(Foodspotting, OAuth2);

module.exports = Foodspotting
