var url = require("url")
  , https = require("https")
  , EventEmitter = require("events").EventEmitter
  , authom = require('authom');

function OAuth2(){}

OAuth2.prototype = new EventEmitter();

OAuth2.prototype.parseURI = function(request) {
  var proto = (request.headers["x-forwarded-proto"] || "").toLowerCase()
    , secure = request.connection.encrypted || proto == "https"
    , protocol = secure ? "https" : "http"
    , host = request.headers.host || request.connection.remoteAddress;

  return url.parse(protocol + "://" + host + request.url, true);
};

OAuth2.prototype.request = function(request, cb) {
  request = Object.create(request);

  request.query = url.format({query: request.query});

  request.method || (request.method = "GET");

  if (request.method == "GET") {
    request.path += request.query;
  }

  else {
    request.body = request.query.slice(1);
    request.headers || (request.headers = {});
    request.headers["Content-Length"] = Buffer.byteLength(request.body);
    request.headers["Content-Type"] = 'application/x-www-form-urlencoded';
  }

  https
    .request(request, function(response) {
      var data = "";

      response.on("data", function(chunk){ data += chunk; });
      response.on("end", function() {
        try { data = JSON.parse(data); }
        catch (e) { data = url.parse("?" + data, true).query; }

        response.statusCode == 200 ? cb(null, data) : cb(data);
      });
    })
    .on("error", cb)
    .end(request.body || "");
};

OAuth2.prototype.onRequest = function(req, res) {
  var uri = req.url = this.parseURI(req);

  // check for verify auth feature, and see if we have a path match
  if(authom.verifyAuth) {
    var match = uri.path.match(authom.route);
    if (match && authom.verifyAuthPath === match[2]) {
      this.onVerifyAuth(req, res, uri);
      return;
    }
  }

  if (uri.query.error) this.emit("error", req, res, uri.query);

  else if (uri.query.code) this.onCode(req, res);

  else this.onStart(req, res);
};

OAuth2.prototype.onStart = function(req, res) {
  this.code.query.redirect_uri = url.format(req.url);

  res.writeHead(302, {Location: url.format(this.code)});
  res.end();
};

OAuth2.prototype.onCode = function(req, res) {
  this.token.query.code = req.url.query.code;

  delete req.url.query;
  delete req.url.search;

  this.token.query.redirect_uri = url.format(req.url);

  this.request(this.token, function(err, data) {
    if (err) return this.emit("error", req, res, err);

    // get the user data object from the auth source
    // and emit auth or error events
    this.getUserAndAuth(req, res, data.access_token);

  }.bind(this));
};

/**
 * Fetch the user data object from the authentication source
 * and if this operation was successful emit the authentication
 * event.
 *
 * We may optionally set a callback function.
 *
 * @param  {object} req The request object
 * @param  {object} res The response object
 * @param  {string} accessToken The access token to perform the operation
 * @param  {Function(string?, object)=} opt_cb Optional callback
 *                                      with the 'err' string as first param
 *                                      and the 'user' object as second,
 *                                      the callback is called before we
 *                                      emit any events ('error' or 'auth').
 * @return {void} nothing.
 */
OAuth2.prototype.getUserAndAuth = function(req, res, accessToken, opt_cb)
{
  var cb = opt_cb || function(){};

  var tokenKey = this.user.tokenKey || "access_token";

  this.user.query[tokenKey] = accessToken;
  this.request(this.user, function(err, user) {
    if (err) {
      cb(err).bind(this);
      return this.emit("error", req, res, err);
    }

    var data = {
      token: accessToken,
      id: this.getId(user),
      data: user
    };

    cb(err, user);
    this.emit("auth", req, res, data);
  }.bind(this));
};


/**
 * Performs authentication verification with the external source.
 *
 * The authentication has already happened on the client side,
 * we are just validating that this stands to truth by requesting
 * the user object from the auth service using the Access Token
 * provided by the client in this request.
 *
 * If we successfully get the auth token then the user is indeed
 * authenticated and we emit the auth event.
 *
 * For security reasons we only allow this operation to be
 * perfoed by a POST request
 *
 * @param  {object} req The request object
 * @param  {object} res The response object
 * @param  {object=} opt_uri Optionaly pass the uri object if already
 *                           parsed, if not passed we parse again...
 * @return {void} nothing.
 */
OAuth2.prototype.onVerifyAuth = function(req, res, opt_uri)
{
  var uri = opt_uri || this.parseURI(req);

  // check if method is POST
  if ('POST' !== req.method) {
    this.emit('error', req, res, {message: 'Only POST is allowed for this action'});
    return;
  }
  // get and validate the access token
  var accessToken = uri.query[authom.verifyAuthAccessTokenParam];
  if ( 'string' === typeof accessToken && 0 < accessToken.length) {
    // get the user data object from the auth source
    // and emit auth or error events
    this.getUserAndAuth(req, res, accessToken);
    return;
  }

  // not a valid access token
  this.emit('error', req, res, {message: 'The access token passed was not valid or was not set. Expected param name:' + authom.verifyAuthAccessTokenParam});

};

OAuth2.prototype.code = null;
OAuth2.prototype.token = null;
OAuth2.prototype.user = null;

OAuth2.prototype.getId = function(data){ return data.id; };

module.exports = OAuth2;
