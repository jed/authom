var OAuth2 = require("./oauth2")
  , util = require("util");

function Signals(options) {

  this.code = {
    protocol: "https",
    host: "launchpad.37signals.com",
    pathname: "/authorization/new",
    query: {
      client_id: options.id,
      type: "web_server",
      scope: options.scope || []
    }
  }

  this.token = {
    method: "POST",
    host:   "launchpad.37signals.com",
    path:   "/authorization/token",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    query: {
      client_id: options.id,
      type: "web_server",
      client_secret: options.secret
    }
  }

  this.user = {
    host: "launchpad.37signals.com",
    path: "/authorization.json",
    query: {}
  }

  this.on("request", this.onRequest.bind(this))

  OAuth2.call(this);
}

util.inherits(Signals, OAuth2);

Signals.prototype.getId = function(data) {
  return data.identity.id
}

module.exports = Signals
