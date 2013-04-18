var authom = require('../../')
  , expect = require('expect.js');
  
describe('Bitbucket', function () {
  it('should be able to create a server', function () {
    var server = authom.createServer({service: 'bitbucket'});

    expect(authom.servers['bitbucket']).to.be(server);
  });
})
