var fs = require("fs")
  , url = require("url")
  , join = require("path").join
  , EventEmitter = require("events").EventEmitter

  , authom = module.exports = new EventEmitter();

authom.servers = {};

/**
 * In case the external auth source supports client
 * side authentication via a JS SDK/API (like Facebook),
 * it is possible for the client to perform the authentication
 * process all on its own.
 *
 * When that is done, all we have to do, server side, is get the
 * Access Token and verify that this user may indeed authenticate
 * with our services honoring his authentication with the third party
 *
 * This switch enables or disables this feature.
 * By default it is disabled
 *
 * @type {boolean}
 */
authom.verifyAuth = false;
/**
 * The string (path) where we can perform an auth verification.
 *
 * This string will match on the third part of the path:
 * e.g. /auth/facebook/verifyAuth
 * or /auth/linkedin/verifyAuth
 *
 * The request to verifyAuth is performed via POST and
 * an access token is expected to be passed
 *
 * @type {string}
 */
authom.verifyAuthPath = 'verifyAuth';
/**
 * In case of a verifyAuth operation, we expect the access token
 * to be passed in the POST request that will be made. This variable
 * defines the name of the parameter where we'll find the access token
 *
 * @type {string}
 */
authom.verifyAuthAccessTokenParam = 'accessToken';
/**
 * This regex will extract the second and third part
 * of a path if it exists:
 * [0] Whole sting, if there is a match
 * [1] Second part of the path
 * [2] Third part of the path
 * @type {RegExp}
 */
authom.route = /^\/auth\/([^\/][\w]+)\/?([\w]+)?.*?$/;

authom.createServer = function(options, listener) {
  var service = options.service
    , name = options.name || service
    , path = join(__dirname, "services", service)
    , Service
    , server;

  try { Service = require(path); }
  catch (err) { throw "No such service: " + path; }

  server = authom.servers[name] = new Service(options);

  server.on("auth", function(req, res, user) {
    user.service = name;
    authom.emit("auth", req, res, user);
  });

  server.on("error", function(req, res, error) {
    error.service = name;
    authom.emit("error", req, res, error);
  });

  if (listener) server.on("request", listener);

  return server;
};

authom.listener = function(req, res) {
  var path = url.parse(req.url).pathname
    , match = path.match(authom.route)
    , service = match && authom.servers[match[1]];

  if (service) {
    service.emit("request", req, res);
    return true;
  }
};

authom.listen = function(server) {
  var listeners = server.listeners("request");

  server.removeAllListeners("request");

  server.on("request", function(req, res) {
    if (authom.listener(req, res)) return;

    listeners.forEach(function(listener) {
      listener.call(server, req, res);
    });
  });
};

authom.app = function(req, res) {
  var name = req.params.service
    , server = authom.servers[name];

  server.emit("request", req, res);
};