var authom = require('../../')
  , expect = require('expect.js');
  
describe('Meetup', function () {
  it('should be able to create a server', function () {
    var server = authom.createServer({service: 'meetup'});

    expect(authom.servers['meetup']).to.be(server);
  });
})
