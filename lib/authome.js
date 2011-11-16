var fs = require("fs")
  , url = require("url")
  , join = require("path").join
  , EventEmitter = require("events").EventEmitter

  , authome = module.exports = new EventEmitter

authome.services = {}
authome.servers = {}

authome.createServer = function(options, listener) {
  var name = options.service
    , Service = authome.services[name]
    , path
    , server

  if (!Service) {
    path = join(__dirname, "services", name)

    try { Service = require(path) }
    catch (err) { throw "No such service: " + path }
  }

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

authome.on("request", function(req, res) {
  var uri = url.parse(req.url, true)
    , query = uri.query
    , service = authome.servers[query.service]

  if (!query.service) return authome.emit(
    "error",
    req, res,
    {message: "No service specified."}
  )

  if (!service) return authome.emit(
    "error",
    req, res,
    {message: "No such service.", service: query.service}
  )

  // if (!query.return_to) {
  //   query.redirect_uri = req.headers.referer || "/"
  //   delete uri.search
  //   req.url = url.format(uri)
  // }

  service.emit("request", req, res)
})

authome.listener = function(req, res) {
  authome.emit("request", req, res)
}

authome.listen = function(server) {
  var listeners = server.listeners("request")

  server.removeAllListeners("request")

  server.on("request", function(req, res) {
    var match = /\/auth(\?|$)/.test(req.url)

    if (match) authome.emit("request", req, res)

    else listeners.forEach(function(listener) {
      listener.call(server, req, res)
    })
  })
}