var OAuth2 = require('./oauth2')
  , util = require('util');

function Vkontakte(options) {
  this.code.query = {
    client_id: options.id
  }

  this.token.query = {
    client_id: options.id,
    client_secret: options.secret
  }

  this.user.query = {}

  if (options.scope) {
    this.code.query.scope = options.scope.join(',')
  }

  if (options.fields) {
    this.user.query.fields = options.fields.join(',')
  }

  this.on('request', this.onRequest.bind(this))

  OAuth2.call(this);
}

util.inherits(Vkontakte, OAuth2);

Vkontakte.prototype.code = {
  protocol: 'https',
  host: 'oauth.vk.com',
  pathname: '/authorize'
}

Vkontakte.prototype.token = {
  method: 'POST',
  host: 'oauth.vk.com',
  path: '/access_token'
}

Vkontakte.prototype.user = {
  host: 'api.vk.com',
  path: '/method/getProfiles'
}

Vkontakte.prototype.getId = function(data) {
  return data.response[0].uid
}

module.exports = Vkontakte
