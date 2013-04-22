var authom = require('../../')
  , expect = require('expect.js');
  
describe('Gowalla', function () {
  it('should be able to create a server', function () {
    var server = authom.createServer({service: 'gowalla'});

    expect(authom.servers['gowalla']).to.be(server);
  });
})
