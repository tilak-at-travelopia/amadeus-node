"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _events = _interopRequireDefault(require("events"));
var _util = _interopRequireDefault(require("util"));
var _access_token = _interopRequireDefault(require("./client/access_token"));
var _listener = _interopRequireDefault(require("./client/listener"));
var _request = _interopRequireDefault(require("./client/request"));
var _validator = _interopRequireDefault(require("./client/validator"));
var _package = _interopRequireDefault(require("../../package.json"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * A convenient wrapper around the API, allowing for generic, authenticated and
 * unauthenticated API calls without having to manage the serialization,
 * desrialization, and authentication.
 *
 * Generally you do not need to use this object directly. Instead it is used
 * indirectly by the various namespaced methods for every API call.
 *
 * For example, the following are the semantically the same.
 *
 * ```js
 * amadeus.client.get('/v1/reference-data/urls/checkin-links', params);
 * amadeus.amadeus.reference_data.urls.checkin_links.get(params);
 * ```
 *
 * @param {Object} options a list of options. See {@link Amadeus} .
 * @property {string} clientId the API key used to authenticate the API
 * @property {string} clientSecret the API secret used to authenticate
 *  the API
 * @property {Object} logger the `console`-compatible logger used to debug calls
 * @property {string} logLevel the log level for the client, available options
 *  are `debug`, `warn`, and `silent`. Defaults to 'silent'
 * @property {string} host the hostname of the server API calls are made to
 * @property {number} port the port the server API calls are made to
 * @property {boolean} ssl wether an SSL request is made to the server
 * @property {string} customAppId the custom App ID to be passed in the User
 *  Agent to the server
 * @property {string} customAppVersion the custom App Version number to be
 *  passed in the User Agent to the server
 * @property {Object} http the Node/HTTP(S)-compatible client used to make
 *  requests
 * @property {number} version The version of this API client
 * @property {boolean} saveToFile whether to save request and response data to files
 * @property {string} logDirectory the directory to save request and response logs
 */
var Client = /*#__PURE__*/function () {
  function Client() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, Client);
    new _validator["default"]().validateAndInitialize(this, options);
    this.accessToken = new _access_token["default"](this);
    this.version = _package["default"].version;
  }

  /**
   * Make an authenticated GET API call.
   *
   * ```js
   * amadeus.client.get('/v2/foo/bar', { some: 'data' });
   * ```
   * @param {string} path the full path of the API endpoint
   * @param {Object} [params={}] the query string parameters
   * @return {Promise.<Response,ResponseError>} a Promise
   */
  return _createClass(Client, [{
    key: "get",
    value: function get(path) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.request("GET", path, params);
    }

    /**
     * Make an authenticated POST API call.
     *
     * ```js
     * amadeus.client.post('/v2/foo/bar', { some: 'data' });
     * ```
     * @param {string} path the full path of the API endpoint
     * @param {Object} [params={}] the POST parameters
     * @return {Promise.<Response,ResponseError>} a Promise
     */
  }, {
    key: "post",
    value: function post(path) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var stringifiedParams = typeof params === "string" ? params : JSON.stringify(params);
      return this.request("POST", path, stringifiedParams);
    }

    /**
     * Make an authenticated PATCH API call.
     *
     * ```js
     * amadeus.client.patch('/v2/foo/bar', { some: 'data' });
     * ```
     * @param {string} path the full path of the API endpoint
     * @param {Object} [params={}] the PATCH parameters
     * @return {Promise.<Response,ResponseError>} a Promise
     */
  }, {
    key: "patch",
    value: function patch(path) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var stringifiedParams = typeof params === "string" ? params : JSON.stringify(params);
      return this.request("PATCH", path, stringifiedParams);
    }

    /**
     * Make an authenticated DELETE API call.
     *
     * ```js
     * amadeus.client.delete('/v2/foo/bar', { some: 'data' });
     * ```
     * @param {string} path the full path of the API endpoint
     * @param {Object} [params={}] the query string parameters
     * @return {Promise.<Response,ResponseError>} a Promise
     */
  }, {
    key: "delete",
    value: function _delete(path) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.request("DELETE", path, params);
    }

    // PROTECTED

    /**
     * Make an authenticated API call.
     *
     * ```js
     * amadeus.client.call('GET', '/v2/foo/bar', { some: 'data' });
     * ```
     * @param {string} verb the HTTP method, for example `GET` or `POST`
     * @param {string} path the full path of the API endpoint
     * @param {Object} [params={}] the POST parameters
     * @return {Promise.<Response,ResponseError>} a Promise
     * @protected
     */
  }, {
    key: "request",
    value: function request(verb, path) {
      var _this = this;
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.accessToken.bearerToken(this).then(function (bearerToken) {
        return _this.unauthenticatedRequest(verb, path, params, bearerToken);
      });
    }

    // PRIVATE

    /**
     * Make any kind of API call, authenticated or not
     *
     * Used by the .get, .post methods to make API calls.
     *
     * Sets up a new Promise and then excutes the API call, triggering the Promise
     * to be called when the API call fails or succeeds.
     *
     * @param {string} verb the HTTP method, for example `GET` or `POST`
     * @param {string} path the full path of the API endpoint
     * @param {Object} params the parameters to pass in the query or body
     * @param {string} [bearerToken=null] the BearerToken as generated by the
     *  AccessToken class
     * @return {Promise.<Response,ResponseError>} a Promise
     * @private
     */
  }, {
    key: "unauthenticatedRequest",
    value: function unauthenticatedRequest(verb, path, params) {
      var bearerToken = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var request = this.buildRequest(verb, path, params, bearerToken);
      var emitter = new _events["default"]();
      var promise = this.buildPromise(emitter);
      this.execute(request, emitter);
      return promise;
    }

    /**
     * Actually executes the API call.
     *
     * @param {Request} request the request to execute
     * @param {EventEmitter} emitter the event emitter to notify of changes
     * @private
     */
  }, {
    key: "execute",
    value: function execute(request, emitter) {
      // Log the request details
      if (this.debug()) {
        this.logger.log("Request:");
        this.logger.log("".concat(request.verb, " ").concat(request.path));
        this.logger.log("Headers:", request.options().headers);

        // Log request body
        var body = request.body();
        if (body) {
          this.logger.log("Body:", body);
        }
        if (request.verb === "GET" && request.params && Object.keys(request.params).length > 0) {
          this.logger.log("Params:", request.params);
        }
      }
      var http_request = this.http.request(request.options());
      var listener = new _listener["default"](request, emitter, this);
      http_request.on("response", listener.onResponse.bind(listener));
      http_request.on("error", listener.onError.bind(listener));
      http_request.write(request.body());
      http_request.end();
    }

    /**
     * Builds a Request object to be used in the API call
     *
     * @param {string} verb the HTTP method, for example `GET` or `POST`
     * @param {string} path the full path of the API endpoint
     * @param {Object} params the parameters to pass in the query or body
     * @param {string} [bearerToken=null] the BearerToken as generated by the
     *  AccessToken class
     * @return {Request}
     * @private
     */
  }, {
    key: "buildRequest",
    value: function buildRequest(verb, path, params, bearerToken) {
      return new _request["default"]({
        host: this.host,
        verb: verb,
        path: path,
        params: params,
        bearerToken: bearerToken,
        clientVersion: this.version,
        languageVersion: process.versions.node,
        appId: this.customAppId,
        appVersion: this.customAppVersion,
        port: this.port,
        ssl: this.ssl,
        customHeaders: this.customHeaders
      });
    }

    /**
     * Builds a Promise to be returned to the API user
     *
     * @param  {type} emitter the event emitter to notify of changes
     * @return {Promise} a promise
     * @private
     */
  }, {
    key: "buildPromise",
    value: function buildPromise(emitter) {
      return new Promise(function (resolve, reject) {
        emitter.on("resolve", function (response) {
          return resolve(response);
        });
        emitter.on("reject", function (error) {
          return reject(error);
        });
      });
    }

    /**
     * Logs the request, when in debug mode
     *
     * @param  {Request} request the request object to log
     * @private
     */
  }, {
    key: "log",
    value: function log(request) {
      /* istanbul ignore next */
      if (this.debug()) {
        this.logger.log(_util["default"].inspect(request, false, null));
      }
    }

    /**
     * Determines if this client is in debug mode
     *
     * @return {boolean}
     */
  }, {
    key: "debug",
    value: function debug() {
      return this.logLevel == "debug";
    }

    /**
     * Determines if this client is in warn or debug mode
     *
     * @return {boolean}
     */
  }, {
    key: "warn",
    value: function warn() {
      return this.logLevel == "warn" || this.debug();
    }
  }]);
}();
var _default = exports["default"] = Client;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXZlbnRzIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsInJlcXVpcmUiLCJfdXRpbCIsIl9hY2Nlc3NfdG9rZW4iLCJfbGlzdGVuZXIiLCJfcmVxdWVzdCIsIl92YWxpZGF0b3IiLCJfcGFja2FnZSIsImUiLCJfX2VzTW9kdWxlIiwiX3R5cGVvZiIsIm8iLCJTeW1ib2wiLCJpdGVyYXRvciIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiX2NsYXNzQ2FsbENoZWNrIiwiYSIsIm4iLCJUeXBlRXJyb3IiLCJfZGVmaW5lUHJvcGVydGllcyIsInIiLCJ0IiwibGVuZ3RoIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJfdG9Qcm9wZXJ0eUtleSIsImtleSIsIl9jcmVhdGVDbGFzcyIsImkiLCJfdG9QcmltaXRpdmUiLCJ0b1ByaW1pdGl2ZSIsImNhbGwiLCJTdHJpbmciLCJOdW1iZXIiLCJDbGllbnQiLCJvcHRpb25zIiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwiVmFsaWRhdG9yIiwidmFsaWRhdGVBbmRJbml0aWFsaXplIiwiYWNjZXNzVG9rZW4iLCJBY2Nlc3NUb2tlbiIsInZlcnNpb24iLCJwa2ciLCJ2YWx1ZSIsImdldCIsInBhdGgiLCJwYXJhbXMiLCJyZXF1ZXN0IiwicG9zdCIsInN0cmluZ2lmaWVkUGFyYW1zIiwiSlNPTiIsInN0cmluZ2lmeSIsInBhdGNoIiwiZGVsZXRlIiwidmVyYiIsIl90aGlzIiwiYmVhcmVyVG9rZW4iLCJ0aGVuIiwidW5hdXRoZW50aWNhdGVkUmVxdWVzdCIsImJ1aWxkUmVxdWVzdCIsImVtaXR0ZXIiLCJFdmVudEVtaXR0ZXIiLCJwcm9taXNlIiwiYnVpbGRQcm9taXNlIiwiZXhlY3V0ZSIsImRlYnVnIiwibG9nZ2VyIiwibG9nIiwiY29uY2F0IiwiaGVhZGVycyIsImJvZHkiLCJrZXlzIiwiaHR0cF9yZXF1ZXN0IiwiaHR0cCIsImxpc3RlbmVyIiwiTGlzdGVuZXIiLCJvbiIsIm9uUmVzcG9uc2UiLCJiaW5kIiwib25FcnJvciIsIndyaXRlIiwiZW5kIiwiUmVxdWVzdCIsImhvc3QiLCJjbGllbnRWZXJzaW9uIiwibGFuZ3VhZ2VWZXJzaW9uIiwicHJvY2VzcyIsInZlcnNpb25zIiwibm9kZSIsImFwcElkIiwiY3VzdG9tQXBwSWQiLCJhcHBWZXJzaW9uIiwiY3VzdG9tQXBwVmVyc2lvbiIsInBvcnQiLCJzc2wiLCJjdXN0b21IZWFkZXJzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXNwb25zZSIsImVycm9yIiwidXRpbCIsImluc3BlY3QiLCJsb2dMZXZlbCIsIndhcm4iLCJfZGVmYXVsdCIsImV4cG9ydHMiLCJtb2R1bGUiLCJkZWZhdWx0Il0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FtYWRldXMvY2xpZW50LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSBcImV2ZW50c1wiO1xuaW1wb3J0IHV0aWwgZnJvbSBcInV0aWxcIjtcblxuaW1wb3J0IEFjY2Vzc1Rva2VuIGZyb20gXCIuL2NsaWVudC9hY2Nlc3NfdG9rZW5cIjtcbmltcG9ydCBMaXN0ZW5lciBmcm9tIFwiLi9jbGllbnQvbGlzdGVuZXJcIjtcbmltcG9ydCBSZXF1ZXN0IGZyb20gXCIuL2NsaWVudC9yZXF1ZXN0XCI7XG5pbXBvcnQgVmFsaWRhdG9yIGZyb20gXCIuL2NsaWVudC92YWxpZGF0b3JcIjtcblxuaW1wb3J0IHBrZyBmcm9tIFwiLi4vLi4vcGFja2FnZS5qc29uXCI7XG5cbi8qKlxuICogQSBjb252ZW5pZW50IHdyYXBwZXIgYXJvdW5kIHRoZSBBUEksIGFsbG93aW5nIGZvciBnZW5lcmljLCBhdXRoZW50aWNhdGVkIGFuZFxuICogdW5hdXRoZW50aWNhdGVkIEFQSSBjYWxscyB3aXRob3V0IGhhdmluZyB0byBtYW5hZ2UgdGhlIHNlcmlhbGl6YXRpb24sXG4gKiBkZXNyaWFsaXphdGlvbiwgYW5kIGF1dGhlbnRpY2F0aW9uLlxuICpcbiAqIEdlbmVyYWxseSB5b3UgZG8gbm90IG5lZWQgdG8gdXNlIHRoaXMgb2JqZWN0IGRpcmVjdGx5LiBJbnN0ZWFkIGl0IGlzIHVzZWRcbiAqIGluZGlyZWN0bHkgYnkgdGhlIHZhcmlvdXMgbmFtZXNwYWNlZCBtZXRob2RzIGZvciBldmVyeSBBUEkgY2FsbC5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgdGhlIGZvbGxvd2luZyBhcmUgdGhlIHNlbWFudGljYWxseSB0aGUgc2FtZS5cbiAqXG4gKiBgYGBqc1xuICogYW1hZGV1cy5jbGllbnQuZ2V0KCcvdjEvcmVmZXJlbmNlLWRhdGEvdXJscy9jaGVja2luLWxpbmtzJywgcGFyYW1zKTtcbiAqIGFtYWRldXMuYW1hZGV1cy5yZWZlcmVuY2VfZGF0YS51cmxzLmNoZWNraW5fbGlua3MuZ2V0KHBhcmFtcyk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBhIGxpc3Qgb2Ygb3B0aW9ucy4gU2VlIHtAbGluayBBbWFkZXVzfSAuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gY2xpZW50SWQgdGhlIEFQSSBrZXkgdXNlZCB0byBhdXRoZW50aWNhdGUgdGhlIEFQSVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGNsaWVudFNlY3JldCB0aGUgQVBJIHNlY3JldCB1c2VkIHRvIGF1dGhlbnRpY2F0ZVxuICogIHRoZSBBUElcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBsb2dnZXIgdGhlIGBjb25zb2xlYC1jb21wYXRpYmxlIGxvZ2dlciB1c2VkIHRvIGRlYnVnIGNhbGxzXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbG9nTGV2ZWwgdGhlIGxvZyBsZXZlbCBmb3IgdGhlIGNsaWVudCwgYXZhaWxhYmxlIG9wdGlvbnNcbiAqICBhcmUgYGRlYnVnYCwgYHdhcm5gLCBhbmQgYHNpbGVudGAuIERlZmF1bHRzIHRvICdzaWxlbnQnXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaG9zdCB0aGUgaG9zdG5hbWUgb2YgdGhlIHNlcnZlciBBUEkgY2FsbHMgYXJlIG1hZGUgdG9cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBwb3J0IHRoZSBwb3J0IHRoZSBzZXJ2ZXIgQVBJIGNhbGxzIGFyZSBtYWRlIHRvXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IHNzbCB3ZXRoZXIgYW4gU1NMIHJlcXVlc3QgaXMgbWFkZSB0byB0aGUgc2VydmVyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gY3VzdG9tQXBwSWQgdGhlIGN1c3RvbSBBcHAgSUQgdG8gYmUgcGFzc2VkIGluIHRoZSBVc2VyXG4gKiAgQWdlbnQgdG8gdGhlIHNlcnZlclxuICogQHByb3BlcnR5IHtzdHJpbmd9IGN1c3RvbUFwcFZlcnNpb24gdGhlIGN1c3RvbSBBcHAgVmVyc2lvbiBudW1iZXIgdG8gYmVcbiAqICBwYXNzZWQgaW4gdGhlIFVzZXIgQWdlbnQgdG8gdGhlIHNlcnZlclxuICogQHByb3BlcnR5IHtPYmplY3R9IGh0dHAgdGhlIE5vZGUvSFRUUChTKS1jb21wYXRpYmxlIGNsaWVudCB1c2VkIHRvIG1ha2VcbiAqICByZXF1ZXN0c1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHZlcnNpb24gVGhlIHZlcnNpb24gb2YgdGhpcyBBUEkgY2xpZW50XG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IHNhdmVUb0ZpbGUgd2hldGhlciB0byBzYXZlIHJlcXVlc3QgYW5kIHJlc3BvbnNlIGRhdGEgdG8gZmlsZXNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBsb2dEaXJlY3RvcnkgdGhlIGRpcmVjdG9yeSB0byBzYXZlIHJlcXVlc3QgYW5kIHJlc3BvbnNlIGxvZ3NcbiAqL1xuY2xhc3MgQ2xpZW50IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgbmV3IFZhbGlkYXRvcigpLnZhbGlkYXRlQW5kSW5pdGlhbGl6ZSh0aGlzLCBvcHRpb25zKTtcbiAgICB0aGlzLmFjY2Vzc1Rva2VuID0gbmV3IEFjY2Vzc1Rva2VuKHRoaXMpO1xuICAgIHRoaXMudmVyc2lvbiA9IHBrZy52ZXJzaW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYW4gYXV0aGVudGljYXRlZCBHRVQgQVBJIGNhbGwuXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIGFtYWRldXMuY2xpZW50LmdldCgnL3YyL2Zvby9iYXInLCB7IHNvbWU6ICdkYXRhJyB9KTtcbiAgICogYGBgXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIHRoZSBmdWxsIHBhdGggb2YgdGhlIEFQSSBlbmRwb2ludFxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtcz17fV0gdGhlIHF1ZXJ5IHN0cmluZyBwYXJhbWV0ZXJzXG4gICAqIEByZXR1cm4ge1Byb21pc2UuPFJlc3BvbnNlLFJlc3BvbnNlRXJyb3I+fSBhIFByb21pc2VcbiAgICovXG4gIGdldChwYXRoLCBwYXJhbXMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXCJHRVRcIiwgcGF0aCwgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIGFuIGF1dGhlbnRpY2F0ZWQgUE9TVCBBUEkgY2FsbC5cbiAgICpcbiAgICogYGBganNcbiAgICogYW1hZGV1cy5jbGllbnQucG9zdCgnL3YyL2Zvby9iYXInLCB7IHNvbWU6ICdkYXRhJyB9KTtcbiAgICogYGBgXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIHRoZSBmdWxsIHBhdGggb2YgdGhlIEFQSSBlbmRwb2ludFxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtcz17fV0gdGhlIFBPU1QgcGFyYW1ldGVyc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxSZXNwb25zZSxSZXNwb25zZUVycm9yPn0gYSBQcm9taXNlXG4gICAqL1xuICBwb3N0KHBhdGgsIHBhcmFtcyA9IHt9KSB7XG4gICAgY29uc3Qgc3RyaW5naWZpZWRQYXJhbXMgPVxuICAgICAgdHlwZW9mIHBhcmFtcyA9PT0gXCJzdHJpbmdcIiA/IHBhcmFtcyA6IEpTT04uc3RyaW5naWZ5KHBhcmFtcyk7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChcIlBPU1RcIiwgcGF0aCwgc3RyaW5naWZpZWRQYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYW4gYXV0aGVudGljYXRlZCBQQVRDSCBBUEkgY2FsbC5cbiAgICpcbiAgICogYGBganNcbiAgICogYW1hZGV1cy5jbGllbnQucGF0Y2goJy92Mi9mb28vYmFyJywgeyBzb21lOiAnZGF0YScgfSk7XG4gICAqIGBgYFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCB0aGUgZnVsbCBwYXRoIG9mIHRoZSBBUEkgZW5kcG9pbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXM9e31dIHRoZSBQQVRDSCBwYXJhbWV0ZXJzXG4gICAqIEByZXR1cm4ge1Byb21pc2UuPFJlc3BvbnNlLFJlc3BvbnNlRXJyb3I+fSBhIFByb21pc2VcbiAgICovXG4gIHBhdGNoKHBhdGgsIHBhcmFtcyA9IHt9KSB7XG4gICAgY29uc3Qgc3RyaW5naWZpZWRQYXJhbXMgPVxuICAgICAgdHlwZW9mIHBhcmFtcyA9PT0gXCJzdHJpbmdcIiA/IHBhcmFtcyA6IEpTT04uc3RyaW5naWZ5KHBhcmFtcyk7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChcIlBBVENIXCIsIHBhdGgsIHN0cmluZ2lmaWVkUGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIGFuIGF1dGhlbnRpY2F0ZWQgREVMRVRFIEFQSSBjYWxsLlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiBhbWFkZXVzLmNsaWVudC5kZWxldGUoJy92Mi9mb28vYmFyJywgeyBzb21lOiAnZGF0YScgfSk7XG4gICAqIGBgYFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCB0aGUgZnVsbCBwYXRoIG9mIHRoZSBBUEkgZW5kcG9pbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXM9e31dIHRoZSBxdWVyeSBzdHJpbmcgcGFyYW1ldGVyc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxSZXNwb25zZSxSZXNwb25zZUVycm9yPn0gYSBQcm9taXNlXG4gICAqL1xuICBkZWxldGUocGF0aCwgcGFyYW1zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KFwiREVMRVRFXCIsIHBhdGgsIHBhcmFtcyk7XG4gIH1cblxuICAvLyBQUk9URUNURURcblxuICAvKipcbiAgICogTWFrZSBhbiBhdXRoZW50aWNhdGVkIEFQSSBjYWxsLlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiBhbWFkZXVzLmNsaWVudC5jYWxsKCdHRVQnLCAnL3YyL2Zvby9iYXInLCB7IHNvbWU6ICdkYXRhJyB9KTtcbiAgICogYGBgXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2ZXJiIHRoZSBIVFRQIG1ldGhvZCwgZm9yIGV4YW1wbGUgYEdFVGAgb3IgYFBPU1RgXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIHRoZSBmdWxsIHBhdGggb2YgdGhlIEFQSSBlbmRwb2ludFxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtcz17fV0gdGhlIFBPU1QgcGFyYW1ldGVyc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxSZXNwb25zZSxSZXNwb25zZUVycm9yPn0gYSBQcm9taXNlXG4gICAqIEBwcm90ZWN0ZWRcbiAgICovXG4gIHJlcXVlc3QodmVyYiwgcGF0aCwgcGFyYW1zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5hY2Nlc3NUb2tlbi5iZWFyZXJUb2tlbih0aGlzKS50aGVuKChiZWFyZXJUb2tlbikgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMudW5hdXRoZW50aWNhdGVkUmVxdWVzdCh2ZXJiLCBwYXRoLCBwYXJhbXMsIGJlYXJlclRva2VuKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFBSSVZBVEVcblxuICAvKipcbiAgICogTWFrZSBhbnkga2luZCBvZiBBUEkgY2FsbCwgYXV0aGVudGljYXRlZCBvciBub3RcbiAgICpcbiAgICogVXNlZCBieSB0aGUgLmdldCwgLnBvc3QgbWV0aG9kcyB0byBtYWtlIEFQSSBjYWxscy5cbiAgICpcbiAgICogU2V0cyB1cCBhIG5ldyBQcm9taXNlIGFuZCB0aGVuIGV4Y3V0ZXMgdGhlIEFQSSBjYWxsLCB0cmlnZ2VyaW5nIHRoZSBQcm9taXNlXG4gICAqIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBBUEkgY2FsbCBmYWlscyBvciBzdWNjZWVkcy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZlcmIgdGhlIEhUVFAgbWV0aG9kLCBmb3IgZXhhbXBsZSBgR0VUYCBvciBgUE9TVGBcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggdGhlIGZ1bGwgcGF0aCBvZiB0aGUgQVBJIGVuZHBvaW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgdGhlIHBhcmFtZXRlcnMgdG8gcGFzcyBpbiB0aGUgcXVlcnkgb3IgYm9keVxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2JlYXJlclRva2VuPW51bGxdIHRoZSBCZWFyZXJUb2tlbiBhcyBnZW5lcmF0ZWQgYnkgdGhlXG4gICAqICBBY2Nlc3NUb2tlbiBjbGFzc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxSZXNwb25zZSxSZXNwb25zZUVycm9yPn0gYSBQcm9taXNlXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB1bmF1dGhlbnRpY2F0ZWRSZXF1ZXN0KHZlcmIsIHBhdGgsIHBhcmFtcywgYmVhcmVyVG9rZW4gPSBudWxsKSB7XG4gICAgbGV0IHJlcXVlc3QgPSB0aGlzLmJ1aWxkUmVxdWVzdCh2ZXJiLCBwYXRoLCBwYXJhbXMsIGJlYXJlclRva2VuKTtcbiAgICBsZXQgZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBsZXQgcHJvbWlzZSA9IHRoaXMuYnVpbGRQcm9taXNlKGVtaXR0ZXIpO1xuXG4gICAgdGhpcy5leGVjdXRlKHJlcXVlc3QsIGVtaXR0ZXIpO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFjdHVhbGx5IGV4ZWN1dGVzIHRoZSBBUEkgY2FsbC5cbiAgICpcbiAgICogQHBhcmFtIHtSZXF1ZXN0fSByZXF1ZXN0IHRoZSByZXF1ZXN0IHRvIGV4ZWN1dGVcbiAgICogQHBhcmFtIHtFdmVudEVtaXR0ZXJ9IGVtaXR0ZXIgdGhlIGV2ZW50IGVtaXR0ZXIgdG8gbm90aWZ5IG9mIGNoYW5nZXNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGV4ZWN1dGUocmVxdWVzdCwgZW1pdHRlcikge1xuICAgIC8vIExvZyB0aGUgcmVxdWVzdCBkZXRhaWxzXG4gICAgaWYgKHRoaXMuZGVidWcoKSkge1xuICAgICAgdGhpcy5sb2dnZXIubG9nKFwiUmVxdWVzdDpcIik7XG4gICAgICB0aGlzLmxvZ2dlci5sb2coYCR7cmVxdWVzdC52ZXJifSAke3JlcXVlc3QucGF0aH1gKTtcbiAgICAgIHRoaXMubG9nZ2VyLmxvZyhcIkhlYWRlcnM6XCIsIHJlcXVlc3Qub3B0aW9ucygpLmhlYWRlcnMpO1xuXG4gICAgICAvLyBMb2cgcmVxdWVzdCBib2R5XG4gICAgICBjb25zdCBib2R5ID0gcmVxdWVzdC5ib2R5KCk7XG4gICAgICBpZiAoYm9keSkge1xuICAgICAgICB0aGlzLmxvZ2dlci5sb2coXCJCb2R5OlwiLCBib2R5KTtcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICByZXF1ZXN0LnZlcmIgPT09IFwiR0VUXCIgJiZcbiAgICAgICAgcmVxdWVzdC5wYXJhbXMgJiZcbiAgICAgICAgT2JqZWN0LmtleXMocmVxdWVzdC5wYXJhbXMpLmxlbmd0aCA+IDBcbiAgICAgICkge1xuICAgICAgICB0aGlzLmxvZ2dlci5sb2coXCJQYXJhbXM6XCIsIHJlcXVlc3QucGFyYW1zKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgaHR0cF9yZXF1ZXN0ID0gdGhpcy5odHRwLnJlcXVlc3QocmVxdWVzdC5vcHRpb25zKCkpO1xuICAgIGxldCBsaXN0ZW5lciA9IG5ldyBMaXN0ZW5lcihyZXF1ZXN0LCBlbWl0dGVyLCB0aGlzKTtcbiAgICBodHRwX3JlcXVlc3Qub24oXCJyZXNwb25zZVwiLCBsaXN0ZW5lci5vblJlc3BvbnNlLmJpbmQobGlzdGVuZXIpKTtcbiAgICBodHRwX3JlcXVlc3Qub24oXCJlcnJvclwiLCBsaXN0ZW5lci5vbkVycm9yLmJpbmQobGlzdGVuZXIpKTtcbiAgICBodHRwX3JlcXVlc3Qud3JpdGUocmVxdWVzdC5ib2R5KCkpO1xuICAgIGh0dHBfcmVxdWVzdC5lbmQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCdWlsZHMgYSBSZXF1ZXN0IG9iamVjdCB0byBiZSB1c2VkIGluIHRoZSBBUEkgY2FsbFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmVyYiB0aGUgSFRUUCBtZXRob2QsIGZvciBleGFtcGxlIGBHRVRgIG9yIGBQT1NUYFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCB0aGUgZnVsbCBwYXRoIG9mIHRoZSBBUEkgZW5kcG9pbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyB0aGUgcGFyYW1ldGVycyB0byBwYXNzIGluIHRoZSBxdWVyeSBvciBib2R5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbYmVhcmVyVG9rZW49bnVsbF0gdGhlIEJlYXJlclRva2VuIGFzIGdlbmVyYXRlZCBieSB0aGVcbiAgICogIEFjY2Vzc1Rva2VuIGNsYXNzXG4gICAqIEByZXR1cm4ge1JlcXVlc3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBidWlsZFJlcXVlc3QodmVyYiwgcGF0aCwgcGFyYW1zLCBiZWFyZXJUb2tlbikge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdCh7XG4gICAgICBob3N0OiB0aGlzLmhvc3QsXG4gICAgICB2ZXJiOiB2ZXJiLFxuICAgICAgcGF0aDogcGF0aCxcbiAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgYmVhcmVyVG9rZW46IGJlYXJlclRva2VuLFxuICAgICAgY2xpZW50VmVyc2lvbjogdGhpcy52ZXJzaW9uLFxuICAgICAgbGFuZ3VhZ2VWZXJzaW9uOiBwcm9jZXNzLnZlcnNpb25zLm5vZGUsXG4gICAgICBhcHBJZDogdGhpcy5jdXN0b21BcHBJZCxcbiAgICAgIGFwcFZlcnNpb246IHRoaXMuY3VzdG9tQXBwVmVyc2lvbixcbiAgICAgIHBvcnQ6IHRoaXMucG9ydCxcbiAgICAgIHNzbDogdGhpcy5zc2wsXG4gICAgICBjdXN0b21IZWFkZXJzOiB0aGlzLmN1c3RvbUhlYWRlcnMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQnVpbGRzIGEgUHJvbWlzZSB0byBiZSByZXR1cm5lZCB0byB0aGUgQVBJIHVzZXJcbiAgICpcbiAgICogQHBhcmFtICB7dHlwZX0gZW1pdHRlciB0aGUgZXZlbnQgZW1pdHRlciB0byBub3RpZnkgb2YgY2hhbmdlc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2VcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGJ1aWxkUHJvbWlzZShlbWl0dGVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGVtaXR0ZXIub24oXCJyZXNvbHZlXCIsIChyZXNwb25zZSkgPT4gcmVzb2x2ZShyZXNwb25zZSkpO1xuICAgICAgZW1pdHRlci5vbihcInJlamVjdFwiLCAoZXJyb3IpID0+IHJlamVjdChlcnJvcikpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExvZ3MgdGhlIHJlcXVlc3QsIHdoZW4gaW4gZGVidWcgbW9kZVxuICAgKlxuICAgKiBAcGFyYW0gIHtSZXF1ZXN0fSByZXF1ZXN0IHRoZSByZXF1ZXN0IG9iamVjdCB0byBsb2dcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGxvZyhyZXF1ZXN0KSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAodGhpcy5kZWJ1ZygpKSB7XG4gICAgICB0aGlzLmxvZ2dlci5sb2codXRpbC5pbnNwZWN0KHJlcXVlc3QsIGZhbHNlLCBudWxsKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgdGhpcyBjbGllbnQgaXMgaW4gZGVidWcgbW9kZVxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgZGVidWcoKSB7XG4gICAgcmV0dXJuIHRoaXMubG9nTGV2ZWwgPT0gXCJkZWJ1Z1wiO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgdGhpcyBjbGllbnQgaXMgaW4gd2FybiBvciBkZWJ1ZyBtb2RlXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICB3YXJuKCkge1xuICAgIHJldHVybiB0aGlzLmxvZ0xldmVsID09IFwid2FyblwiIHx8IHRoaXMuZGVidWcoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDbGllbnQ7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLE9BQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLEtBQUEsR0FBQUYsc0JBQUEsQ0FBQUMsT0FBQTtBQUVBLElBQUFFLGFBQUEsR0FBQUgsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFHLFNBQUEsR0FBQUosc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFJLFFBQUEsR0FBQUwsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFLLFVBQUEsR0FBQU4sc0JBQUEsQ0FBQUMsT0FBQTtBQUVBLElBQUFNLFFBQUEsR0FBQVAsc0JBQUEsQ0FBQUMsT0FBQTtBQUFxQyxTQUFBRCx1QkFBQVEsQ0FBQSxXQUFBQSxDQUFBLElBQUFBLENBQUEsQ0FBQUMsVUFBQSxHQUFBRCxDQUFBLGdCQUFBQSxDQUFBO0FBQUEsU0FBQUUsUUFBQUMsQ0FBQSxzQ0FBQUQsT0FBQSx3QkFBQUUsTUFBQSx1QkFBQUEsTUFBQSxDQUFBQyxRQUFBLGFBQUFGLENBQUEsa0JBQUFBLENBQUEsZ0JBQUFBLENBQUEsV0FBQUEsQ0FBQSx5QkFBQUMsTUFBQSxJQUFBRCxDQUFBLENBQUFHLFdBQUEsS0FBQUYsTUFBQSxJQUFBRCxDQUFBLEtBQUFDLE1BQUEsQ0FBQUcsU0FBQSxxQkFBQUosQ0FBQSxLQUFBRCxPQUFBLENBQUFDLENBQUE7QUFBQSxTQUFBSyxnQkFBQUMsQ0FBQSxFQUFBQyxDQUFBLFVBQUFELENBQUEsWUFBQUMsQ0FBQSxhQUFBQyxTQUFBO0FBQUEs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