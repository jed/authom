var url   = require("url")
  , https = require("https")

module.exports = function(options) {
  ["id", "secret"].forEach(function(name) {
    if (!options[name]) throw new Error(
      "No application " + name + " provided.\n" +
      "Obtain one at https://code.google.com/apis/console/"
    )
  })

  var server = this

    , authorize = {
        protocol: "https",
        host: "www.facebook.com",
        pathname: "/dialog/oauth",
        query: {
          client_id: options.id,
          scope: options.scope || [],
        }
      }

    , access = {
        method: "POST",
        host: "graph.facebook.com",
        path: "/oauth/access_token",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        query: {
          client_id: options.id,
          client_secret: options.secret
        }
      }

    , user = {
        method: "GET",
        host: "graph.facebook.com",
        pathname: "/me",
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
      delete query.code
      delete uri.search
      access.query.redirect_uri = url.format(uri)
      access.body = url.format({query: access.query}).slice(1)

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
          })
          .on("error", onError).end()
        })
      }).on("error", onError).end(access.body)
    }

    else if (query.error) server.emit(
      "error",
      req, res,
      {code: query.error, message: query.error_description}
    )

    else {
      authorize.query.redirect_uri = url.format(uri)

      res.writeHead(302, {Location: url.format(authorize)})
      res.end()
    }
  })
}