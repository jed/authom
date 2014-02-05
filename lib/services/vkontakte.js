var OAuth2 = require("./oauth2")
  , util = require("util");

function Vkontakte(options) {
  this.code = {
    protocol: "https",
    host: "oauth.vk.com",
    pathname: "/authorize",
    query: {
      client_id: options.id
    }
  }

  this.token = {
    method: "POST",
    host: "oauth.vk.com",
    path: "/access_token",
    query: {
      client_id: options.id,
      client_secret: options.secret
    }
  }

  this.user = {
    host: "api.vk.com",
    path: "/method/users.get",
    query: {
      v: "5.0"
    }
  }

  if (options.scope) {
    this.code.query.scope = options.scope.join(",")
  }

  if (options.fields) {
    this.user.query.fields = options.fields.join(",")
  }

  this.on("request", this.onRequest.bind(this))

  OAuth2.call(this);
}

util.inherits(Vkontakte, OAuth2);

Vkontakte.prototype.getId = function(data) {
  return data.response[0].id
}

module.exports = Vkontakte
