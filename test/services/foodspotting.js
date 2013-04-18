var authom = require('../../')
  , expect = require('expect.js');
  
describe('Food Spotting', function () {
  it('should be able to create a server', function () {
    var server = authom.createServer({service: 'foodspotting'});

    expect(authom.servers['foodspotting']).to.be(server);
  });
})
