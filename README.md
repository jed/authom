authom
=======

authom is an authentication library for node.js. It unifies authentication APIs for multiple services into a single EventEmitter, and works with both the built-in node.js HTTP module and as an Express/Connect app.

authom was designed to solve one problem and solve it well. It has an intuitive node.js-like API, no required dependencies, and doesn't force any particular persistence, session, or middleware approaches on you.

Example
-------

For the built-in node.js HTTP module:

```javascript
// Like socket.io, authom will intercept requests
// for you to help keep your routes clean.

var server = require("http").createServer()
  , authom = require("authom")

server.on("request", function() {
  // your usual server logic
})

// create servers for the services you'll be using
authom.createServer({ /* facebook credentials */ })
authom.createServer({ /* github credentials */ })
authom.createServer({ /* google credentials */ })
authom.createServer({ /* twitter credentials */ })
// ... et cetera

authom.on("auth", function(req, res, data) {
  // called when a user is authenticated on any service
})

authom.on("error", function(req, res, data) {
  // called when an error occurs during authentication
})

authom.listen(server)
server.listen(8000)
```

For Express/Connect:

```javascript
var express = require("express")
  , app = express()
  , authom = require("authom")

// create servers for the services you'll be using
authom.createServer({ /* facebook credentials */ })
authom.createServer({ /* github credentials */ })
authom.createServer({ /* google credentials */ })
authom.createServer({ /* twitter credentials */ })
// ... et cetera

authom.on("auth", function(req, res, data) {
  // called when a user is authenticated on any service
})

authom.on("error", function(req, res, data) {
  // called when an error occurs during authentication
})

app.get("/auth/:service", authom.app)

app.listen(8000)
```

Supported services
------------------

<img src="https://raw.githubusercontent.com/jed/authom/master/lib/assets/37signals.ico" style="vertical-align:middle"> 37signals (by [nodebiscut](https://github.com/nodebiscut))

<img src="https://raw.githubusercontent.com/jed/authom/master/lib/assets/bitbucket.png" style="vertical-align:middle" width="16" height="16"> Bitbucket (by [aslakhellesoy](https://github.com/aslakhellesoy))

<img src="https://raw.githubusercontent.com/jed/authom/master/lib/assets/dropbox.ico" style="vertical-align:middle"> Dropbox (by [cartuchogl](https://github.com/cartuchogl))

<img src="https://raw.githubusercontent.com/jed/authom/master/lib/assets/dwolla.ico" style="vertical-align:middle"> Dwolla (by [nodebiscut](https://github.com/nodebiscut))

<img src="https://raw.githubusercontent.com/jed/authom/master/lib/assets/facebook.ico" style="vertical-align:middle"> Facebook (by [jed](https://github.com/jed))

<img src="https://raw.githubusercontent.com/jed/authom/master/lib/assets/fitbit.ico" style="vertical-align:middle"> Fitbit (by [pspeter3](https://github.com/pspeter3))

<img src="https://raw.githubusercontent.com/jed/authom/master/lib/assets/foodspotting.ico" style="vertical-align:middle"> Foodspotting (by [kimtaro](https://github.com/kimtaro))

<img src="https://raw.githubusercontent.com/jed/authom/master/lib/assets/foursquare.ico" style="vertical-align:middle"> Foursquare (by [nodebiscut](https://github.com/nodebiscut))

<img src="https://raw.githubusercontent.com/jed/authom/master/lib/assets/github.ico" style="vertical-align:middle"> GitHub (by [jed](https://github.com/jed))

<img src="https://raw.githubusercontent.com/jed/authom/master/lib/assets/google.ico" style="vertical-align:middle"> Google (by [jed](https://github.com/jed))

<img src="https://raw.githubusercontent.com/jed/authom/master/lib/assets/gowalla.ico" style="vertical-align:middle"> Gowalla (by [jed](https://github.com/jed))

<img src="https://raw.githubusercontent.com/jed/authom/master/lib/assets/instagram.ico" style="vertical-align:middle"> Instagram (by [jed](https://github.com/jed))

<img src="https://raw.githubusercontent.com/jed/authom/master/lib/assets/linkedin.ico" style="vertical-align:middle"> LinkedIn (by [shinecita](https://github.com/shinecita))

<img src="https://raw.githubusercontent.com/jed/authom/master/lib/assets/meetup.ico" style="vertical-align:middle"> Meetup (by [softprops](https://github.com/softprops))

<img src="https://raw.githubusercontent.com/jed/authom/master/lib/assets/reddit.png" style="vertical-align:middle"> Reddit (by [avidw](https://github.com/avidw))

<img src="https://raw.githubusercontent.com/jed/authom/master/lib/assets/soundcloud.ico" style="vertical-align:middle"> SoundCloud (by [jed](https://github.com/jed))

<img src="https://raw.githubusercontent.com/jed/authom/master/lib/assets/trello.ico" style="vertical-align:middle"> Trello (by [falexandrou](https://github.com/falexandrou))

<img src="https://raw.githubusercontent.com/jed/authom/master/lib/assets/twitter.ico" style="vertical-align:middle"> Twitter (by [jed](https://github.com/jed))

<img src="https://raw.githubusercontent.com/jed/authom/master/lib/assets/vkontakte.ico" style="vertical-align:middle"> Vkontakte (by [molforp](https://github.com/molforp))

<img src="https://raw.githubusercontent.com/jed/authom/master/lib/assets/windowslive.ico" style="vertical-align:middle"> Windows Live (by [jed](https://github.com/jed))

<img src="https://raw.githubusercontent.com/jed/authom/master/lib/assets/ninjablocks.ico" style="vertical-align:middle"> Ninja Blocks (by [thatguydan](https://github.com/thatguydan))

Installation and Setup
----------------------

To install, enter:

    $ npm install authom

To see the demo, enter:

    $ npm start authom

And then head to http://authom.jedschmidt.com (which resolves to your local machine at `127.0.0.1`). `sudo` is needed to bind to port 80, as many providers do not allow callback URLs with a port or `localhost` as the host.

FAQ
---

### How can I add my own service?

See **Extending authom** below.

### Why not just use [everyauth](https://github.com/bnoguchi/everyauth)/[passport](https://github.com/jaredhanson/passport)? How is authom different?

authom aims to solve a smaller problem, more agnostically. It trades convenience for simplicity and flexibility. Here are some key differences:

- authom was built for node, and can also work with Express, while everyauth is tied to Express and Connect. everyauth aims for a much more ambitious integration, but at the expense of locking you into a particular stack. authom takes a more UNIX approach; since it doesn't handle logins, persistence, sessions, or anything past authentication, it is more of a tool and less of a framework.

- authom uses native node.js conventions such as EventEmitters and objects, while everyauth uses promises and a chaining config API. This is of course subjective, but the authom API aims to be closer to the APIs of node.js itself.

API
---

### authom.createServer(options, [function(req, res){}])

Creates an EventEmitter for the given authentication service. The service is specified by the `service` key of the `options` object, with all other keys differing based on the service. For example, `github` would be called like this:

```javascript
var github = authom.createServer({
  service: "github",
  id: "7e38d12b740a339b2d31",
  secret: "116e41bd4cd160b7fae2fe8cc79c136a884928c3",
  scope: ["gist"]
})
```

An optional `name` member can also be passed to override that used for authom path matching. So if you had two GitHub apps, you could set them as `name: github1` and `name: github2`, so that they could be accessed as `/auth/github1` and `/auth/github2`.

You can listen for `auth` and `error` events by:

- listening to a specific service for service-specific events, or
- listening to `authom` for all service events

For example, use this to listen for events from GitHub, based on the code above:

```javascript
github.on("auth", function(req, res, gitHubSpecificData){})
github.on("error", function(req, res, gitHubSpecificData){})
```

Or, use this to listen to events from all provders, since authom already listens and namespaces them for you:

```javascript
authom.on("auth", function(req, res, data){})
authom.on("error", function(req, res, data){})
```

### authom.on("auth", function(req, res, data){})

Listens for successful authentications across all services. The listener is called with the original request/response objects as well as a service-specific user object, which contains the following keys:

- `token`: the token resulting from authentication
- `refresh_token`: the refresh_token resulting from authentication, if implemented by auth service, otherwise `undefined`
- `id`: the ID of the user on the remote service
- `data`: the original data returned from the service, and
- `service`: the name of the service, given so that you can branch your code:

```javascript
authom.on("auth", function(req, res, data) {
  switch(data.service) {
    case "github": ...
    case "google": ...
    .
    .
    .
  }
})
```

### authom.on("error", function(req, res, data){})

Listens for failed authentications across all services. Like the `auth` event, the listener is called with the original request/response objects as well as an error object, allowing you to provide your own session scheme.

### authom.listen(server)

Listens to an existing HTTP(S) server for `request` events. Like socket.io's `.listen` method, authom will intercept any request whose path starts with `/auth`.

### authom.listener

A standard node.js listener. This can be used for more control over the path at which authom is used. For example, the following two are equivalent:

```javascript
// socket.io-style
var server = require("http").createServer()
  , authom = require("authom")

server.on("request", function() {
  /* your usual server logic */
})

authom.listen(server)
server.listen(8000)
```

```javascript
// route-style
var server = require("http").createServer()
  , authom = require("authom")

server.on("request", function(req, res) {
  if (req.url.slice(5) == "/auth") authom.listener(req, res)

  else {
	/* your usual server logic */
  }
})

server.listen(8000)
```

### authom.registerService(serviceName, Service)

Authom-compliant services can be registered using this method. This is useful for adding custom authentication services not suited to be part of the ```/lib``` core services. (For example a business-specific in-house authentication service.) _Custom services will override existing services of the same name._

```javascript
var authom = require("authom")
  , EventEmitter = require("events").EventEmitter

//Custom authentication service
var IpAuth = function(options) {
  var server = new EventEmitter
  var whiteList = options.whiteList || ["127.0.0.1", "::1"]

  server.on("request", function(req, res) {
    if (~whiteList.indexOf(req.connection.remoteAddress)) {
      server.emit("auth", req, res, {status: "yay"})
    }
    else {
      server.emit("error", req, res, {status: "boo"})
    }
  })

  return server
}

authom.registerService("ip-auth", IpAuth)

auth.createServer({
  service: "ip-auth",
  whiteList : ["127.0.0.1", "::1", "192.168.0.1"]
})
```

### authom.route

A regular expression that is run on the pathname of every request. authom will only run if this expression is matched. By default, it is `/^\/auth\/([^\/]+)\/?$/`.

### authom.app

This is a convenience Express app, which should be mounted at a path containing a `:service` parameter.


Providers
---------

### 37signals ([create an app](https://integrate.37signals.com/apps/))

Options:

- `service`: "37signals"
- `id`: the application's `Client ID`
- `secret`: the application's `Client secret`

Example:

```javascript
var signals = authom.createServer({
  service: "37signals",
  id: "c2098292571a03070eb12746353997fb8d6f0e00",
  secret: "4cb7f46fa83f73ec99d37162b946522b9e7a4d5a"
})
```

### Dropbox ([create an app](https://www.dropbox.com/developers/apps))

Options:

- `service`: "dropbox"
- `id`: the application's `App key`
- `secret`: the application's `App secret`
- `info`: specify `true` if you want to get the user info (a little slower - one extra request)

Example:

```javascript
var dropbox = authom.createServer({
  service: "dropbox",
  id: "zuuteb2w7i82mdg",
  secret: "rj503lgqodxzvbp"
  info: true
})
```

### Dwolla Live ([create an app](https://www.dwolla.com/applications))

Options:

- `service`: "dwolla"
- `id`: the application's `Client ID`
- `secret`: the application's `Client secret`
- `scope`: the scope requested.

Example:

```javascript
var dwolla = authom.createServer({
  service: "dwolla",
  id: "0vNUP/9/GSBXEv69nqKZVfhSZbw8XQdnDiatyXSTM7vW1WzAAU",
  secret: "KI2tdLiRZ813aclUxTgUVyDbxysoJQzPBjHTJ111nHMNdAVlcs",
  scope: "AccountInfoFull"
})
```

### Facebook ([create an app](https://developers.facebook.com/apps))

Options:

- `service`: "facebook"
- `id`: the application's `App ID`
- `secret`: the application's `App secret`
- `scope` (optional): the scopes requested by your application
- `fields` (optional): the fields passed onto `/users/me`
Example:

```javascript
var facebook = authom.createServer({
  service: "facebook",
  id: "256546891060909",
  secret: "e002572fb07423fa66fc38c25c9f49ad",
  scope: [],
  fields: ["name", "picture"]
})
```

### Fitbit ([request api key](https://dev.fitbit.com/apps/new))

Options:

- `service`: "fitbit"
- `id`: the application's `Client ID`
- `secret`: the application's `Client secret`

Example:

```javascript
var fitbit = authom.createServer({
  service: "fitbit",
  id: "45987d27b0e14780bb1a6f1769e679dd",
  secret: "3d403aaeb5b84bc49e98ef8b946a19d5"
})
```

### Foodspotting ([request api key](http://www.foodspotting.com/api))

Options:

- `service`: "foodspotting"
- `id`: the application's `Client ID`
- `secret`: the application's `Client secret`

Example:

```javascript
var foodspotting = authom.createServer({
  service: "foodspotting",
  id: "<api key>",
  secret: "<api secret>"
})
```

### Foursquare ([create an app](https://foursquare.com/oauth/))

Options:

- `service`: "foursquare"
- `id`: the application's `CLIENT ID`
- `secret`: the application's `CLIENT SECRET`

Example:

```javascript
var foursquare = authom.createServer({
  service: "foursquare",
  id: "0DPGLE430Y2LFUCOSFXB0ACG3GGD5DNHH5335FLT4US1QDAZ",
  secret: "WLNCAVFHCMQGVYOZTNOLPXW0XL2KN0DRD1APOA45SRGEZSGK"
})
```

### GitHub ([create an app](https://github.com/settings/applications/new))

[Full Docs](http://developer.github.com/v3/oauth/)

Options:

- `service`: "github"
- `id`: the application's `Client ID`
- `secret`: the application's `Secret`
- `redirect_uri` (optional): Alternative redirect url.
- `scope` (optional): the scopes requested by your application, as explained [here](http://developer.github.com/v3/oauth/#scopes).
- `state` (optional): Unguessable random string.

Example:

```javascript
var github = authom.createServer({
  service: "github",
  id: "7e38d12b740a339b2d31",
  secret: "116e41bd4cd160b7fae2fe8cc79c136a884928c3",
  scope: "gist"
})
```

Make sure that the callback URL used by your application has the same hostname and port as that specified for your application. If they are different, you will get `redirect_uri_mismatch` errors.

### Bitbucket (Go to https://bitbucket.org/account/user/YOURACCOUNT/api to create an app)

Options:

- `service`: "bitbucket"
- `id`: the application's `Key`
- `secret`: the application's `Secret`
- `emails`: specify `true` if you want to get the user's emails (a little slower - one extra request)

Example:

```javascript
var bitbucket = authom.createServer({
  service: "bitbucket",
  id: "Fs7WNJSqgUSL8zBAZD",
  secret: "yNTv52kS7DWSztpLgbLWKD2AaNxGq2mB",
  emails: true
})
```

### Google ([create an app](https://code.google.com/apis/console/))

Options:

- `service`: "google"
- `id`: the application's `Client ID`
- `secret`: the application's `Client secret`
- `scope` (optional): the scopes requested by your application

Example:

```javascript
var google = authom.createServer({
  service: "google",
  id: "515913292583.apps.googleusercontent.com",
  secret: "UAjUGd_MD9Bkho-kazmJ5Icm",
  scope: ""
})
```

### Gowalla ([create an app](http://gowalla.com/api/keys))

Options:

- `service`: "gowalla"
- `id`: the application's `API key`
- `secret`: the application's `Secret key`

Example:

```javascript
var gowalla = authom.createServer({
  service: "gowalla",
  id: "b8514b75c2674916b77c9a913783b9c2",
  secret: "34f713fdd6b4488982328487f443bd6d"
})
```

Make sure that the callback URL used by your application is identical to that specified for your application. With the default settings, you'll need a redirect URI of `http://<your-host>/auth/google`.

### Instagram ([create an app](http://instagram.com/developer/client/register/))

Options:

- `service`: "instagram"
- `id`: the application's `CLIENT ID`
- `secret`: the application's `CLIENT SECRET`
- `scope` (optional): the scopes requested by your application

Example:

```javascript
var instagram = authom.createServer({
  service: "instagram",
  id: "e55497d0ebc24289aba4e715f1ab7d2a",
  secret: "a0e7064bfda64e57a46dcdba48378776"
})
```

### Reddit ([create an app](https://ssl.reddit.com/prefs/apps/))

Options:

- `service`: "reddit"
- `id`: the application's `CLIENT ID`
- `secret`: the application's `CLIENT SECRET`
- `state`: Unguessable random string.
- `scope` (optional): the scopes requested by your application

Example:

```javascript
var reddit = authom.createServer({
  service: "reddit",
  id: "hG5c04ZOk0UngQ",
  secret: "mdJoGP4ayA9M7NdBiKxZUyewz7M",
  state: "unguessable-random-string",
  scope: "identity"
})
```

### SoundCloud ([create an app](http://soundcloud.com/you/apps/new))

Options:

- `service`: "soundcloud"
- `id`: the application's `Client ID`
- `secret`: the application's `Client Secret`

Example:

```javascript
var soundcloud = authom.createServer({
  service: "soundcloud",
  id: "9e5e7b0a891b4a2b13aeae9e5b0c89bb",
  secret: "2f4df63c8ff10f466685c305e87eba6f"
})
```

### Trello ([create an app](https://trello.com/docs/gettingstarted/index.html#getting-an-application-key))

Options:

- `service`: "trello"
- `id`: the application's `Consumer key`
- `secret`: the application's `Consumer secret`
- `app_name`: the application's `name`
- `expiration`: optional - when the token expires (examples: `never`, `30days`, `1day`). Default is `30days`
- `scope`: optional - by default the scope is set to `read`. Example: `read,write`

Example:

```javascript
var trello = authom.createServer({
  service: "trello",
  id: "LwjCfHAugMghuYtHLS9Ugw",
  secret: "etam3XHqDSDPceyHti6tRQGoywiISY0vZWfzhQUxGL4",
  app_name: "Coolest app in the world",
  expiration: "never",
  scope: "read,write",
})
```

### Twitter ([create an app](https://dev.twitter.com/apps/new))

Options:

- `service`: "twitter"
- `id`: the application's `Consumer key`
- `secret`: the application's `Consumer secret`

Example:

```javascript
var twitter = authom.createServer({
  service: "twitter",
  id: "LwjCfHAugMghuYtHLS9Ugw",
  secret: "etam3XHqDSDPceyHti6tRQGoywiISY0vZWfzhQUxGL4"
})
```

Notes: Since Twitter is still (!) using the old OAuth1.0a protocol, it requires [@ciaranj](https://github.com/ciaranj)'s [node-oauth](https://github.com/ciaranj/node-oauth) library to be installed.

### Vkontakte ([create an app](http://vk.com/editapp?act=create))

Options:

- `service`: "vkontakte"
- `id`: the application's `App ID`
- `secret`: the application's `App secret`
- `scope` (optional): the scopes requested by your application
- `fields` (optional): the fields passed onto `/method/users.get`

Example:

```javascript
var vkontakte = authom.createServer({
  service: "vkontakte",
  id: "3793488",
  secret: "jZnIeU4nnQfqM5mfjkK0",
  scope: [],
  fields: ["screen_name", "sex", "photo"]
})
```

### Windows Live ([create an app](https://manage.dev.live.com/Applications/Index))

Options:

- `service`: "windowslive"
- `id`: the application's `Client ID`
- `secret`: the application's `Client secret`
- `scope`: the scope requested.

Example:

```javascript
var windowslive = authom.createServer({
  service: "windowslive",
  id: "000000004C06BA3A",
  secret: "2RsIhweMq6PxR8jc5CjTVoCqTvKZmctY",
  scope: "wl.basic"
})
```

### LinkedIn ([create an app](https://www.linkedin.com/secure/developer?newapp=))

Options:

- `service`: "linkedin"
- `id`: the application's `Api key`
- `secret`: the application's `Secret key`
- `scopes`: Optional. An array with the scopes, fe: ["r_fullprofile", "r_emailaddress"]. Default: r_fullprofile
- `fields`: Optional. Comma separated (no spaces) String with the linkedIn [fields](https://developer.linkedin.com/documents/profile-fields#fullprofile) to include in the query, fe: "first-name,last-name,picture-url,industry,summary,specialties,skills,projects,headline,site-standard-profile-request"
- `format`: Optional. Format of the response, default "json".

Example:

```javascript
var linkedin = authom.createServer({
  service: "linkedin",
  id: "AsjCfHAugMghuYtHLS9Xzy",
  secret: "arom3XHqDSDPceyHti6tRQGoywiISY0vZWfzhQUxXZ5"
})
```


Extending authom
-----------------

To add an authentication service provider, add a javascript file for the service at the path `/lib/services/<service-name>.js`. This file should `module.exports` a constructor that returns an EventEmitter that listens for `request` events, and emits `auth` and `error` events to itself.

```javascript
var EventEmitter = require("events").EventEmitter

module.exports = function(options) {
  var server = new EventEmitter

  server.on("request", function(req, res) {
    // respond to the request, redirecting the user as needed

    if (successful) {
      // pass an object containing the service's user data
      server.emit("auth", req, res, obj)
    }

    else {
      // pass an object containing an error message
      server.emit("error", req, res, obj)
    }
  })

  return server
}
```

To make sure that your code can recieve subsequent HTTP(S) calls from the service, use the inbound `req.url` as the callback URL, using the querystring to disambiguate different stages of the authentication process. See `/lib/services/github.js` for an example implementation.

Once you're done, and have written tests, make sure you open a pull request so that the rest of us can benefit!

License
-------

Copyright (c) 2012 Jed Schmidt, http://jed.is/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
