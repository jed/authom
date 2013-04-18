var authom = require('../../')
  , expect = require('expect.js');
  
describe('Google', function () {
  it('should be able to create a server', function () {
    var server = authom.createServer({service: 'google'});

    expect(authom.servers['google']).to.be(server);
  });
})
