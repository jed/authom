var authom = require('../../')
  , expect = require('expect.js');
  
describe('OAuth2', function () {
  it('should be able to create a server', function () {
    var server = authom.createServer({service: 'oauth2'});

    expect(authom.servers['oauth2']).to.be(server);
  });
})