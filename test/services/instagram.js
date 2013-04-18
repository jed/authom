var authom = require('../../')
  , expect = require('expect.js');
  
describe('Instagram', function () {
  it('should be able to create a server', function () {
    var server = authom.createServer({service: 'instagram'});

    expect(authom.servers['instagram']).to.be(server);
  });
})
