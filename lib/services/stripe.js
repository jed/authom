var OAuth2 = require("./oauth2")
  , util = require("util");

function Stripe(options) {

  this.code = {
    protocol: "https",
    host: "connect.stripe.com",
    pathname: "/oauth/authorize",
    query: {
      response_type: 'code',
      scope: options.scope || 'read_only',
      client_id: options.id
    }
  };

  this.token = {
    method: "POST",
    host: "connect.stripe.com",
    path: "/oauth/token",
    query: {
      grant_type: 'authorization_code',
      client_id: options.id,
      client_secret: options.secret
    }
  };

  this.user = {
    host: "api.stripe.com",
    path: "/v1/account",
    query: {}
  };

  if(options.stripe_landing) {
    this.code.query.stripe_landing = options.stripe_landing;
  }

  if(options.state) {
    this.code.query.state = options.state;
  }

  this.on("request", this.onRequest.bind(this));

  OAuth2.call(this, options);
}

util.inherits(Stripe, OAuth2);

module.exports = Stripe;
