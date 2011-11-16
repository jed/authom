Authome
=======

Authome is an authentication library for node.js. It unifies authentication APIs for multiple services into a single EventEmitter.

Authome was designed to solve one problem and solve it well. It has an intuitive node.js-like API, no external dependencies, and doesn't force any particular persistence, session, middleware approaches on you.

Authome is pronounced [ˈôTHəm], like "awesome" while holding your tongue.

Example
-------

```javascript
// Like socket.io, Authome will intercept requests
// for you to help keep your routes clean.

var server = require("http").createServer()
  , authome = require("authome")

server.on("request", function() {
  // your usual server logic
})

// create servers for the services you'll be using
authome.createServer({ /* facebook credentials */ })
authome.createServer({ /* github credentials */ })
authome.createServer({ /* google credentials */ })
authome.createServer({ /* foursquare credentials */ })
// ... et cetera

authome.on("auth", function(req, res, data) {
  // called when a user is authenticated on any service
})

authome.on("error", function(req, res, data) {
  // called when an error occurs during authentication
})

authome.listen(server)
server.listen(8000)
```

Installation and Setup
----------------------

To install, enter:

    $ npm install authome

To see the demo, enter:

    $ npm start authome

And then head to http://authome.jedschmidt.com (which resolves to your local machine at `127.0.0.1`). `sudo` is needed to bind to port 80, as many providers do not allow callback URLs with a port or `localhost` as the host.

Supported services
------------------

- Github (by [jed](https://github.com/jed))
- Google (by [jed](https://github.com/jed))
- Facebook (by [jed](https://github.com/jed))
- Foursquare (by [nodebiscut](https://github.com/nodebiscut))
- Instagram (by [jed](https://github.com/jed))
- Gowalla (by [jed](https://github.com/jed))
- 37signals (by [nodebiscut](https://github.com/nodebiscut))

FAQ
---

### How can I add my own service?

See **Extending Authome** below.

### Why not just use [everyauth](https://github.com/bnoguchi/everyauth)/[passport](https://github.com/jaredhanson/passport)? How is Authome different?

Authome aims to solve a smaller problem, more agnostically. It trades convenience for simplicity and flexibility. Here are some key differences:

- Authome was built for node, while everyauth was built for Express and Connect. everyauth aims for a much more ambitious integration, but at the expense of locking you into a particular stack. Authome takes a more UNIX approach; since it doesn't handle logins, persistence, sessions, or anything past authentication, it is more of a tool and less of a framework.

- Authome uses native node.js conventions such as EventEmitters and objects, while everyauth uses promises and a chaining config API. This is of course subjective, but the Authome API aims to be closer to the APIs of node.js itself.

- Authome works with node.js v0.6. (this was not true of everyauth at the time this library was written)

API
---

### authome.createServer(options, [function(req, res){}])

Creates an EventEmitter for the given authentication service. The service is specified by the `service` key of the `options` object, with all other keys differing based on the service. For example, `github` would be called like this:

```javascript
var github = authome.createServer({
  service: "github",
  id: "7e38d12b740a339b2d31",
  secret: "116e41bd4cd160b7fae2fe8cc79c136a884928c3",
  scope: ["gist"]
})
```

An optional `name` member can also be passed to override that used for Authome path matching. So if you had two Github apps, you could set them as `name: github1` and `name: github2`, so that they could be accessed as `/auth/github1` and `/auth/github2`.

You can listen for `auth` and `error` events by:

- listening to a specific service for service-specific events, or
- listening to `authome` for all service events

For example, use this to listen for events from Github, based on the code above:

```javascript
github.on("auth", function(req, res, gitHubSpecificData){})
github.on("error", function(req, res, gitHubSpecificData){})
```

Or, use this to listen to events from all provders, since authome already listens and namespaces them for you:

```javascript
authome.on("auth", function(req, res, data){})
authome.on("error", function(req, res, data){})
```

### authome.on("auth", function(req, res, data){})

Listens for successful authentications across all services. The listener is called with the original request/response objects as well as a service-specific user object, allowing you to provide your own session scheme. The name of the service is given in the `service` key so that you can branch your own code:

```javascript
authome.on("auth", function(req, res, data) {
  switch(data.service) {
    case "github": ...
    case "google": ...
    .
    .
    .
  }
})
```

### authome.on("error", function(req, res, data){})

Listens for failed authentications across all services. Like the `auth` event, the listener is called with the original request/response objects as well as an error object, allowing you to provide your own session scheme.

### authome.listen(server)

Listens to an existing HTTP(S) server for `request` events. Like socket.io's `.listen` method, Authome will intercept any request whose path starts with `/auth`.

### authome.listener

A standard node.js listener. This can be used for more control over the path at which Authome is used. For example, the following two are equivalent:

```javascript
// socket.io-style
var server = require("http").createServer()
  , authome = require("authome")

server.on("request", function() {
  /* your usual server logic */
})

authome.listen(server)
server.listen(8000)
```

```javascript
// route-style
var server = require("http").createServer()
  , authome = require("authome")

server.on("request", function(req, res) {
  if (req.url.slice(5) == "/auth") authome.listener(req, res)

  else {
	/* your usual server logic */
  }
})

server.listen(8000)
```

### authome.route

A regular expression that is run on the pathname of every request. Authome will only run if this expression is matched. By default, it is `/^\/auth\/([^\/]+)\/?$/`.

Providers
---------

### Github ([create an app](https://github.com/account/applications/new))

Options:

- `service`: "github"
- `id`: the application's `Client ID`
- `secret`: the application's `Secret`
- `scope` (optional): the scopes requested by your application, as explained [here](http://developer.github.com/v3/oauth/#scopes).

Example:

```javascript
var github = authome.createServer({
  service: "github",
  id: "7e38d12b740a339b2d31",
  secret: "116e41bd4cd160b7fae2fe8cc79c136a884928c3",
  scope: ["gist"]
})
```

Make sure that the callback URL used by your application has the same hostname and port as that specified for your application. If they are different, you will get `redirect_uri_mismatch` errors.

### Google ([create an app](https://code.google.com/apis/console/))

Options:

- `service`: "google"
- `id`: the application's `Client ID`
- `secret`: the application's `Client secret`
- `scope` (optional): the scopes requested by your application

Example:

```javascript
var google = authome.createServer({
  service: "google",
  id: "515913292583.apps.googleusercontent.com",
  secret: "UAjUGd_MD9Bkho-kazmJ5Icm",
  scope: ""
})
```

Make sure that the callback URL used by your application is identical to that specified for your application. With the default settings, you'll need a redirect URI of `http://<your-host>/auth/google`.

### Facebook ([create an app](https://developers.facebook.com/apps))

Options:

- `service`: "facebook"
- `id`: the application's `App ID`
- `secret`: the application's `App secret`
- `scope` (optional): the scopes requested by your application

Example:

```javascript
var facebook = authome.createServer({
  service: "facebook",
  id: "256546891060909",
  secret: "e002572fb07423fa66fc38c25c9f49ad",
  scope: []
})
```

### Foursquare ([create an app](https://foursquare.com/oauth/))

Options:

- `service`: "foursquare"
- `id`: the application's `CLIENT ID`
- `secret`: the application's `CLIENT SECRET`

Example:

```javascript
var foursquare = authome.createServer({
  service: "foursquare",
  id: "0DPGLE430Y2LFUCOSFXB0ACG3GGD5DNHH5335FLT4US1QDAZ",
  secret: "WLNCAVFHCMQGVYOZTNOLPXW0XL2KN0DRD1APOA45SRGEZSGK"
})
```

### Instagram ([create an app](http://instagram.com/developer/client/register/))

Options:

- `service`: "instagram"
- `id`: the application's `CLIENT ID`
- `secret`: the application's `CLIENT SECRET`
- `scope` (optional): the scopes requested by your application

Example:

```javascript
var instagram = authome.createServer({
  service: "instagram",
  id: "e55497d0ebc24289aba4e715f1ab7d2a",
  secret: "a0e7064bfda64e57a46dcdba48378776"
})
```
### Gowalla ([create an app](http://gowalla.com/api/keys))

Options:

- `service`: "gowalla"
- `id`: the application's `API key`
- `secret`: the application's `Secret key`

Example:

```javascript
var gowalla = authome.createServer({
  service: "gowalla",
  id: "b8514b75c2674916b77c9a913783b9c2",
  secret: "34f713fdd6b4488982328487f443bd6d"
})
```

### 37signals ([create an app](https://integrate.37signals.com/apps/))

Options:

- `service`: "37signals"
- `id`: the application's `Client ID`
- `secret`: the application's `Client secret`

Example:

```javascript
var signals = authome.createServer({
  service: "37signals",
  id: "c2098292571a03070eb12746353997fb8d6f0e00",
  secret: "4cb7f46fa83f73ec99d37162b946522b9e7a4d5a"
})
```

Extending Authome
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

Copyright (c) 2011 Jed Schmidt, http://jed.is/
 
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