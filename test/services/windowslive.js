var authom = require('../../')
  , expect = require('expect.js');
  
describe('Windows Live', function () {
  it('should be able to create a server', function () {
    var server = authom.createServer({service: 'windowslive'});

    expect(authom.servers['windowslive']).to.be(server);
  });
})