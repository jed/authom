var url = require("url")
  , https = require("https")
  , EventEmitter = require("events").EventEmitter

function OAuth2(){}

OAuth2.prototype = new EventEmitter

OAuth2.prototype.parseURI = function(request) {
  var protocol = request.socket.encrypted ? "https" : "http"
    , host = request.headers.host || request.connection.remoteAddress
  
  return url.parse(protocol + "://" + host + request.url, true)
}

OAuth2.prototype.request = function(request, cb) {
  request = Object.create(request)

  request.query = url.format({query: request.query})

  request.method || (request.method = "GET")

  if (request.method == "GET") {
    request.path += request.query
  }

  else {
    request.body = request.query.slice(1)
    request.headers || (request.headers = {})
    request.headers["Content-Length"] = Buffer.byteLength(request.body)
  }

  https
    .request(request, function(response) {
      var data = ""

      response.on("data", function(chunk){ data += chunk })
      response.on("end", function() {
        try { data = JSON.parse(data) }
        catch (e) { data = url.parse("?" + data, true).query }

        response.statusCode == 200 ? cb(null, data) : cb(data)
      })
    })
    .on("error", cb)
    .end(request.body || "")
}

OAuth2.prototype.onRequest = function(req, res) {
  var uri = req.url = this.parseURI(req)

  if (uri.query.error) this.emit("error", req, res, uri.query)

  else if (uri.query.code) this.onCode(req, res)

  else this.onStart(req, res)
}

OAuth2.prototype.onStart = function(req, res) {
  this.code.query.redirect_uri = url.format(req.url)

  res.writeHead(302, {Location: url.format(this.code)})
  res.end()
}

OAuth2.prototype.onCode = function(req, res) {
  this.token.query.code = req.url.query.code

  delete req.url.query
  delete req.url.search

  this.token.query.redirect_uri = url.format(req.url)

  this.request(this.token, function(err, data) {
    if (err) return this.emit("error", req, res, err)

    var tokenKey = this.user.tokenKey || "access_token"

    this.user.query[tokenKey] = data.access_token

    this.request(this.user, function(err, user) {
      if (err) return this.emit("error", req, res, err)

      data = {
        token: data.access_token,
        id: this.getId(user),
        data: user
      }

      this.emit("auth", req, res, data)
    }.bind(this))
  }.bind(this))
}

OAuth2.prototype.code = null
OAuth2.prototype.token = null
OAuth2.prototype.user = null

OAuth2.prototype.getId = function(data){ return data.id }

module.exports = OAuth2