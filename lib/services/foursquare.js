var url   = require("url")
  , https = require("https")

module.exports = function(options) {
  ["id", "secret"].forEach(function(name) {
    if (!options[name]) throw new Error(
      "No application " + name + " provided.\n" +
      "Obtain one at https://foursquare.com/oauth/"
    )
  })

  var server = this

    , authorize = {
        protocol: "https",
        host: "foursquare.com",
        pathname: "/oauth2/authenticate",
        query: {
          client_id: options.id,
          response_type: 'code',
          scope: options.scope || []
        }
      }
    , access = {
        method: "POST",
        host: "foursquare.com",
        pathname: "/oauth2/access_token",
        query: {
          client_id: options.id,
          client_secret: options.secret,
          grant_type: 'authorization_code'          
        }
      }

    , user = {
        method: "GET",
        host: "api.foursquare.com",
        pathname: "/v2/users/self",
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
      access.query.redirect_uri = url.format(uri)            
      access.path = access.pathname + url.format({query: access.query})

      https.request(access, function(response) {
        var token = ""

        response.on("data", function(chunk){ token += chunk })

        response.on("end", function() {
          token = JSON.parse(token).access_token

       
          user.query.oauth_token = token
          user.path = user.pathname + url.format({query: user.query})

          https.request(user, function(response) {
            var data = ""

            response.on("data", function(chunk){ data += chunk })
            response.on("end", function() {
              try { data = JSON.parse(data) }
              catch (err) { onError(err) }
              data.access_token = token
              server.emit("auth", req, res, data.response.user)
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