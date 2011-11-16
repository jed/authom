var fs = require("fs")
  , url = require("url")
  , join = require("path").join
  , EventEmitter = require("events").EventEmitter

  , authome = module.exports = new EventEmitter

authome.servers = {}
authome.route = /^\/auth\/([^\/]+)\/?$/

authome.createServer = function(options, listener) {
  var service = options.service
    , name = options.name || service
    , path = join(__dirname, "services", service)
    , Service
    , server

  try { Service = require(path) }
  catch (err) { throw "No such service: " + path }

  server = authome.servers[name] = new Service(options)

  server.on("auth", function(req, res, user) {
    authome.emit("auth", req, res, {service: name, user: user})
  })

  server.on("error", function(req, res, error) {
    authome.emit("error", req, res, {service: name, error: error})
  })

  if (listener) server.on("request", listener)

  return server  
}

authome.listener = function(req, res) {
  var path = url.parse(req.url).pathname
    , match = path.match(authome.route)
    , service = match && authome.servers[match[1]]

  if (service) {
    service.emit("request", req, res)
    return true
  }
}

authome.listen = function(server) {
  var listeners = server.listeners("request")

  server.removeAllListeners("request")

  server.on("request", function(req, res) {
    if (authome.listener(req, res)) return

    listeners.forEach(function(listener) {
      listener.call(server, req, res)
    })
  })
}