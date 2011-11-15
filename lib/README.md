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

authome.createServer({
  service: "github",
  id: "<your-github-application-id>",
  secret: "<your-github-application-secret>",
  scope: [ /* optional list of scopes */ ]
})

authome.on("auth", function(req, res, data) {
  // called when a user is authenticated on any service
})

authome.on("error", function(req, res, data) {
  // called when an error occurs during authentication
})

authome.listen(server)
server.listen(8000)

// hit http://localhost/auth?service=github to authenticate
```

Installation
------------

    $ npm install authome

FAQ
---

### What authentication services are supported?

Right now, just Github. I would love your help in adding more.

### How can I add my own service?

See **Extending Authome** below.

### Why not just use everyauth? How is Authome different?

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

Providers
---------

### Github

Start off by [creating an application on Github](https://github.com/account/applications/new). Then, to enable Github OAuth2 authentication on your site, call `authome.createServer` with the Github-specific options:

- `service`: "github"
- `id`: the application's `Client ID`
- `secret`: the application's `Secret`
- `scope` (optional): the scopes requested by your application, as explained [here](http://developer.github.com/v3/oauth/#scopes).

```javascript
var github = authome.createServer({
  service: "github",
  id: "7e38d12b740a339b2d31",
  secret: "116e41bd4cd160b7fae2fe8cc79c136a884928c3",
  scope: ["gist"]
})
```

Make sure that the callback URL used by your application has the same hostname and port as that specified for your application. If they are different, you will get `redirect_uri_mismatch` errors.

Extending Authome
-----------------

To add an authentication service provider, add a javascript file for the service at the path `/lib/services/<service-name>.js`. This file should `module.export` a single function.

```javascript
module.exports = function(options) {
  var server = this // an event emitter specific to this service

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