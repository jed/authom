var authom = require('../../')
  , expect = require('expect.js');
  
describe('Fitbit', function () {
  it('should be able to create a server', function () {
    var server = authom.createServer({service: 'fitbit'});

    expect(authom.servers['fitbit']).to.be(server);
  });
})
