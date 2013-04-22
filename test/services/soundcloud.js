var authom = require('../../')
  , expect = require('expect.js');
  
describe('Soundcloud', function () {
  it('should be able to create a server', function () {
    var server = authom.createServer({service: 'soundcloud'});

    expect(authom.servers['soundcloud']).to.be(server);
  });
})