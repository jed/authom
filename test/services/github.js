var authom = require('../../')
  , expect = require('expect.js');
  
describe('Github', function () {
  it('should be able to create a server', function () {
    var server = authom.createServer({service: 'github'});

    expect(authom.servers['github']).to.be(server);
  });
})
