var authom = require('../../')
  , expect = require('expect.js');
  
describe('Dropbox', function () {
  it('should be able to create a server', function () {
    var server = authom.createServer({service: 'dropbox'});

    expect(authom.servers['dropbox']).to.be(server);
  });
})
