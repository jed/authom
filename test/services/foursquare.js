var authom = require('../../')
  , expect = require('expect.js');
  
describe('Foursquare', function () {
  it('should be able to create a server', function () {
    var server = authom.createServer({service: 'foursquare'});

    expect(authom.servers['foursquare']).to.be(server);
  });
})
