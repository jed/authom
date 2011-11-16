var http = require("http")
  , authome = require("./index")
  , server = http.createServer()
  , port = process.env.PORT || 80

  , questions = Buffer(
      "<html>" +
        "<body style='font: 300% sans-serif'>" +
          "<div><a href='/auth?service=github'>Who am I on Github?</a></div>" +
          "<div><a href='/auth?service=google'>Who am I on Google?</a></div>" +
          "<div><a href='/auth?service=facebook'>Who am I on Facebook?</a></div>" +
          "<div><a href='/auth?service=foursquare'>Who am I on Foursquare?</a></div>" +                    
        "</body>" +
      "</html>"
    )

server.on("request", function(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/html",
    "Content-Length": questions.length
  })

  res.end(questions)
})

authome.createServer({
  service: "github",
  id: "7e38d12b740a339b2d31",
  secret: "116e41bd4cd160b7fae2fe8cc79c136a884928c3",
  scope: []
})

authome.createServer({
  service: "google",
  id: "515913292583.apps.googleusercontent.com",
  secret: "UAjUGd_MD9Bkho-kazmJ5Icm"
})

authome.createServer({
  service: "facebook",
  id: "256546891060909",
  secret: "e002572fb07423fa66fc38c25c9f49ad"
})

authome.createServer({
  service: "foursquare",
  id: "0DPGLE430Y2LFUCOSFXB0ACG3GGD5DNHH5335FLT4US1QDAZ",
  secret: "WLNCAVFHCMQGVYOZTNOLPXW0XL2KN0DRD1APOA45SRGEZSGK"
})

authome.on("auth", function(req, res, data) {
  console.log(data)
  var name = ({
    github: data.user.name,
    google: data.user.name,
    facebook: data.user.name,
    foursquare: data.user.firstName + " " + data.user.lastName 
  })[data.service]

  var answer = Buffer(
    "<html>" +
      "<body style='font: 300% sans-serif'>" +
        "<div>You are " + name + ".</div>" +
      "</body>" +
    "</html>"
  )

  res.writeHead(200, {
    "Content-Type": "text/html",
    "Content-Length": answer.length
  })

  res.end(answer)
})

authome.on("error", function(req, res, data){
  data = Buffer("An error occurred: " + JSON.stringify(data))

  res.writeHead(500, {
    "Content-Type": "text/plain",
    "Content-Length": data.length
  })

  res.end(data)
})

authome.listen(server)
server.listen(port, function() {
  console.log("listening on port %s", port)
})