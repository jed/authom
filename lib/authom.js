var fs = require("fs")
  , url = require("url")
  , join = require("path").join
  , EventEmitter = require("events").EventEmitter
  , authom = module.exports = new EventEmitter

authom.servers = {}
authom.customServices = {}
authom.route = /^\/auth\/([^\/]+)\/?$/

authom.createServer = function(options, listener) {
  var service = options.service
    , name = options.name || service
    , path = join(__dirname, "services", service)
    , Service
    , server

  if (!(Service = authom.customServices[name])) {
    try { Service = require(path) }
    catch (err) { throw "No such service: " + path }
  }

  server = authom.servers[name] = new Service(options)

  server.on("auth", function(req, res, user) {
    user.service = name
    authom.emit("auth", req, res, user)
  })

  server.on("error", function(req, res, error) {
    error.service = name
    authom.emit("error", req, res, error)
  })

  if (listener) server.on("request", listener)

  return server  
}

authom.registerService = function(serviceName, Service) {
  authom.customServices[serviceName] = Service
}

authom.listener = function(req, res) {
  var path = url.parse(req.url).pathname
    , match = path.match(authom.route)
    , service = match && authom.servers[match[1]]

  if (service) {
    service.emit("request", req, res)
    return true
  }
}

authom.listen = function(server) {
  var listeners = server.listeners("request")

  server.removeAllListeners("request")

  server.on("request", function(req, res) {
    if (authom.listener(req, res)) return

    listeners.forEach(function(listener) {
      listener.call(server, req, res)
    })
  })
}

authom.app = function(req, res) {
  var name = req.params.service
    , server = authom.servers[name]

  server.emit("request", req, res)
}