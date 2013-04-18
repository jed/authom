var authom = require('../../')
  , expect = require('expect.js');
  
describe('Twitter', function () {
  it('should be able to create a server', function () {
    var server = authom.createServer({service: 'twitter'});

    expect(authom.servers['twitter']).to.be(server);
  });
})