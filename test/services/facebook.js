var authom = require('../../')
  , expect = require('expect.js');
  
describe('Facebook', function () {
  it('should be able to create a server', function () {
    var server = authom.createServer({service: 'facebook'});

    expect(authom.servers['facebook']).to.be(server);
  });
})
