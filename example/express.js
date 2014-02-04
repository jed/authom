var express = require("express")
  , authom = require("../lib/authom")
  , app = express()
  , port = process.env.PORT || 80

authom.createServer({
  service: "github",
  id: "7e38d12b740a339b2d31",
  secret: "116e41bd4cd160b7fae2fe8cc79c136a884928c3"
})

authom.createServer({
  service: "google",
  id: "515913292583.apps.googleusercontent.com",
  secret: "UAjUGd_MD9Bkho-kazmJ5Icm"
})

authom.createServer({
  service: "facebook",
  id: "256546891060909",
  secret: "e002572fb07423fa66fc38c25c9f49ad"
})

authom.createServer({
  service: "foursquare",
  id: "0DPGLE430Y2LFUCOSFXB0ACG3GGD5DNHH5335FLT4US1QDAZ",
  secret: "WLNCAVFHCMQGVYOZTNOLPXW0XL2KN0DRD1APOA45SRGEZSGK"
})

authom.createServer({
  service: "instagram",
  id: "e55497d0ebc24289aba4e715f1ab7d2a",
  secret: "a0e7064bfda64e57a46dcdba48378776"
})

authom.createServer({
  service: "gowalla",
  id: "b8514b75c2674916b77c9a913783b9c2",
  secret: "34f713fdd6b4488982328487f443bd6d"
})

authom.createServer({
  service: "37signals",
  id: "c2098292571a03070eb12746353997fb8d6f0e00",
  secret: "4cb7f46fa83f73ec99d37162b946522b9e7a4d5a"
})

authom.createServer({
  service: "soundcloud",
  id: "9e5e7b0a891b4a2b13aeae9e5b0c89bb",
  secret: "2f4df63c8ff10f466685c305e87eba6f"
})

authom.createServer({
  service: "windowslive",
  id: "000000004C06BA3A",
  secret: "2RsIhweMq6PxR8jc5CjTVoCqTvKZmctY",
  scope: "wl.basic"
})

authom.createServer({
  service: "dwolla",
  id: "0vNUP/9/GSBXEv69nqKZVfhSZbw8XQdnDiatyXSTM7vW1WzAAU",
  secret: "KI2tdLiRZ813aclUxTgUVyDbxysoJQzPBjHTJ111nHMNdAVlcs",
  scope:"AccountInfoFull"
})

authom.createServer({
  service: "twitter",
  id: "LwjCfHAugMghuYtHLS9Ugw",
  secret: "etam3XHqDSDPceyHti6tRQGoywiISY0vZWfzhQUxGL4"
})

authom.createServer({
  service: "linkedin",
  id: "bc8kg8qo87z6",
  secret: "0azYQoOJ9vF8i7mC",
  scopes:["r_fullprofile"]
})

authom.createServer({
  service: "fitbit",
  id: "45987d27b0e14780bb1a6f1769e679dd",
  secret: "3d403aaeb5b84bc49e98ef8b946a19d5"
})

authom.createServer({
  service: "dropbox",
  id: "zuuteb2w7i82mdg",
  secret: "rj503lgqodxzvbp",
  info: true
})

authom.createServer({
  service: "bitbucket",
  id: "2sD26teP8SVfStUwMd",
  secret: "vTeXLmyXubwFkrBAP96KRjgT8tubVqpD",
  emails: true
})

authom.createServer({
  service: "vkontakte",
  id: "3793488",
  secret: "jZnIeU4nnQfqM5mfjkK0",
  fields: ['screen_name', 'sex', 'photo']
})

app.get("/auth/:service", authom.app)

app.get("/", function(req, res) {
  res.send(
    "<html>" +
      "<body style='font: 300% sans-serif'>" +
        "<div><a href='/auth/37signals'>Who am I on 37Signals?</a></div>" +
        "<div><a href='/auth/dwolla'>Who am I on Dwolla?</a></div>" +
        "<div><a href='/auth/github'>Who am I on Github?</a></div>" +
        "<div><a href='/auth/google'>Who am I on Google?</a></div>" +
        "<div><a href='/auth/facebook'>Who am I on Facebook?</a></div>" +
        "<div><a href='/auth/fitbit'>Who am I on Fitbit?</a></div>" +
        "<div><a href='/auth/foursquare'>Who am I on Foursquare?</a></div>" +
        "<div><a href='/auth/gowalla'>Who am I on Gowalla?</a></div>" +
        "<div><a href='/auth/instagram'>Who am I on Instagram?</a></div>" +
        "<div><a href='/auth/linkedin'>Who am I on LinkedIn?</a></div>" +
        "<div><a href='/auth/meetup'>Who am I on Meetup?</a></div>" +
        "<div><a href='/auth/soundcloud'>Who am I on SoundCloud?</a></div>" +
        "<div><a href='/auth/twitter'>Who am I on Twitter?</a></div>" +
        "<div><a href='/auth/windowslive'>Who am I on Windows Live?</a></div>" +  
        "<div><a href='/auth/dropbox'>Who am I on Dropbox?</a></div>" +  
        "<div><a href='/auth/bitbucket'>Who am I on Bitbucket?</a></div>" +
        "<div><a href='/auth/vkontakte'>Who am I on Vkontakte?</a></div>" +
      "</body>" +
    "</html>"
  )
})

authom.on("auth", function(req, res, data) {
  res.send(
    "<html>" +
      "<body>" +
        "<div style='font: 300% sans-serif'>You are " + data.id + " on " + data.service + ".</div>" +
        "<pre><code>" + JSON.stringify(data, null, 2) + "</code></pre>" +
      "</body>" +
    "</html>"
  )
})

authom.on("error", function(req, res, data){
  res.error("An error occurred: " + JSON.stringify(data))
})

app.listen(port, function() {
  console.log("listening at http://authom.jedschmidt.com/")
})
