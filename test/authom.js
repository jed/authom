var authom = require('../')
  , expect = require('expect.js');

describe('Authom', function () {
  it('should be able to create a server', function () {
    var server = authom.createServer({service: 'twitter'});

    expect(authom.servers['twitter']).to.be(server);
  });
  
  it('should be able to register a custom service', function () {
    authom.registerService('testService', function () {this.on = function () {}});
    
    var server = authom.createServer({service: 'testService'});
    
    expect(authom.servers['testService']).to.be(server);
  });
});