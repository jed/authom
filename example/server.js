var http = require("http")
  , authome = require("authome")
  , server = http.createServer()
  , port = process.env.PORT || 80

  , questions = Buffer(
      "<html>" +
        "<body style='font: 300% sans-serif'>" +
          "<div><a href='/auth/github'>Who am I on Github?</a></div>" +
          "<div><a href='/auth/google'>Who am I on Google?</a></div>" +
          "<div><a href='/auth/facebook'>Who am I on Facebook?</a></div>" +
          "<div><a href='/auth/foursquare'>Who am I on Foursquare?</a></div>" +
          "<div><a href='/auth/instagram'>Who am I on Instagram?</a></div>" +
          "<div><a href='/auth/gowalla'>Who am I on Gowalla?</a></div>" +
          "<div><a href='/auth/37signals'>Who am I on 37Signals?</a></div>" +          
          "<div><a href='/auth/soundcloud'>Who am I on SoundCloud?</a></div>" +          
          "<div><a href='/auth/windowslive'>Who am I on Windows Live?</a></div>" +          
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
  secret: "116e41bd4cd160b7fae2fe8cc79c136a884928c3"
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

authome.createServer({
  service: "instagram",
  id: "e55497d0ebc24289aba4e715f1ab7d2a",
  secret: "a0e7064bfda64e57a46dcdba48378776"
})

authome.createServer({
  service: "gowalla",
  id: "b8514b75c2674916b77c9a913783b9c2",
  secret: "34f713fdd6b4488982328487f443bd6d"
})

authome.createServer({
  service: "37signals",
  id: "c2098292571a03070eb12746353997fb8d6f0e00",
  secret: "4cb7f46fa83f73ec99d37162b946522b9e7a4d5a"
})

authome.createServer({
  service: "soundcloud",
  id: "9e5e7b0a891b4a2b13aeae9e5b0c89bb",
  secret: "2f4df63c8ff10f466685c305e87eba6f"
})

authome.createServer({
  service: "windowslive",
  id: "000000004C06BA3A",
  secret: "2RsIhweMq6PxR8jc5CjTVoCqTvKZmctY",
  scope: "wl.basic"
})

authome.on("auth", function(req, res, data) {
  var name, answer

  console.log(data)

  switch (data.service) {
    case "github": name = data.user.name; break
    case "google": name = data.user.name; break
    case "facebook": name = data.user.name; break
    case "foursquare": name = [data.user.response.user.firstName, data.user.response.user.lastName ].join(" "); break
    case "instagram": name = data.user.data.full_name; break
    case "gowalla": name = [data.user.first_name, data.user.last_name].join(" "); break
    case "37signals": name = [data.user.identity.first_name, data.user.identity.last_name].join(" ")
    case "soundcloud": name = data.user.full_name; break
    case "windowslive": name = [data.user.first_name, data.user.last_name].join(" "); break
  }
  
  answer = Buffer(
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
  console.log("listening at http://authome.jedschmidt.com/")
})