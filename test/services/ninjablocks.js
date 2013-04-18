var authom = require('../../')
  , expect = require('expect.js');
  
describe('NinjaBlocks', function () {
  it('should be able to create a server', function () {
    var server = authom.createServer({service: 'ninjablocks'});

    expect(authom.servers['ninjablocks']).to.be(server);
  });
})