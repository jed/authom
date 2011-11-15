var url   = require("url")
  , https = require("https")

module.exports = function(options) {
  ["id", "secret"].forEach(function(name) {
    if (!options[name]) throw new Error(
      "No application " + name + " provided.\n" +
      "Obtain one at https://github.com/account/applications"
    )
  })

  var server = this

      authorize = {
        protocol: "https",
        host: "github.com",
        pathname: "/login/oauth/authorize",
        query: {
          client_id: options.id,
          scope: options.scope || []
        }
      },

      access = {
        method: "POST",
        host: "github.com",
        pathname: "/login/oauth/access_token",
        query: {
          client_id: options.id,
          client_secret: options.secret
        }
      }

      user = {
        method: "GET",
        host: "api.github.com",
        pathname: "/user",
        query: {}
      }

  server.on("request", function(req, res) {
    var protocol = res.socket.encrypted ? "https" : "http"
      , host = req.headers.host || req.connection.remoteAddress
      , uri = url.parse(protocol + "://" + host + req.url, true)
      , query = uri.query
      , onError = server.emit.bind(server, "error", req, res)

    if (query.code) {
      access.query.code = query.code
      access.path = access.pathname + url.format({query: access.query})

      https.request(access, function(response) {
        var token = ""

        response.on("data", function(chunk){ token += chunk })

        response.on("end", function() {
          token = url.parse("?" + token, true).query.access_token
          user.query.access_token = token
          user.path = user.pathname + url.format({query: user.query})

          https.request(user, function(response) {
            var data = ""

            response.on("data", function(chunk){ data += chunk })
            response.on("end", function() {
              try { data = JSON.parse(data) }
              catch (err) { onError(err) }

              data.access_token = token
              server.emit("auth", req, res, data)
            })
          }).on("error", onError).end()
        })
      }).on("error", onError).end()
    }

    else if (query.error) server.emit(
      "error",
      req, res,
      {message: query.error}
    )

    else {
      authorize.query.redirect_uri = url.format(uri)

      res.writeHead(302, {Location: url.format(authorize)})
      res.end()
    }
  })
}