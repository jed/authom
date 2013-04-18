var authom = require('../../')
  , expect = require('expect.js');
  
describe('37 Signals', function () {
  it('should be able to create a server', function () {
    var server = authom.createServer({service: '37signals'});

    expect(authom.servers['37signals']).to.be(server);
  });
})
