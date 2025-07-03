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
      return this.request('GET', path, params);
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
      var stringifiedParams = typeof params === 'string' ? params : JSON.stringify(params);
      return this.request('POST', path, stringifiedParams);
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
      var stringifiedParams = typeof params === 'string' ? params : JSON.stringify(params);
      return this.request('PATCH', path, stringifiedParams);
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
      return this.request('DELETE', path, params);
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
      var http_request = this.http.request(request.options());
      var listener = new _listener["default"](request, emitter, this);
      http_request.on('response', listener.onResponse.bind(listener));
      http_request.on('error', listener.onError.bind(listener));
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
        emitter.on('resolve', function (response) {
          return resolve(response);
        });
        emitter.on('reject', function (error) {
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
      return this.logLevel == 'debug';
    }

    /**
     * Determines if this client is in warn or debug mode
     *
     * @return {boolean}
     */
  }, {
    key: "warn",
    value: function warn() {
      return this.logLevel == 'warn' || this.debug();
    }
  }]);
}();
var _default = exports["default"] = Client;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXZlbnRzIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsInJlcXVpcmUiLCJfdXRpbCIsIl9hY2Nlc3NfdG9rZW4iLCJfbGlzdGVuZXIiLCJfcmVxdWVzdCIsIl92YWxpZGF0b3IiLCJfcGFja2FnZSIsImUiLCJfX2VzTW9kdWxlIiwiX3R5cGVvZiIsIm8iLCJTeW1ib2wiLCJpdGVyYXRvciIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiX2NsYXNzQ2FsbENoZWNrIiwiYSIsIm4iLCJUeXBlRXJyb3IiLCJfZGVmaW5lUHJvcGVydGllcyIsInIiLCJ0IiwibGVuZ3RoIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJfdG9Qcm9wZXJ0eUtleSIsImtleSIsIl9jcmVhdGVDbGFzcyIsImkiLCJfdG9QcmltaXRpdmUiLCJ0b1ByaW1pdGl2ZSIsImNhbGwiLCJTdHJpbmciLCJOdW1iZXIiLCJDbGllbnQiLCJvcHRpb25zIiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwiVmFsaWRhdG9yIiwidmFsaWRhdGVBbmRJbml0aWFsaXplIiwiYWNjZXNzVG9rZW4iLCJBY2Nlc3NUb2tlbiIsInZlcnNpb24iLCJwa2ciLCJ2YWx1ZSIsImdldCIsInBhdGgiLCJwYXJhbXMiLCJyZXF1ZXN0IiwicG9zdCIsInN0cmluZ2lmaWVkUGFyYW1zIiwiSlNPTiIsInN0cmluZ2lmeSIsInBhdGNoIiwiZGVsZXRlIiwidmVyYiIsIl90aGlzIiwiYmVhcmVyVG9rZW4iLCJ0aGVuIiwidW5hdXRoZW50aWNhdGVkUmVxdWVzdCIsImJ1aWxkUmVxdWVzdCIsImVtaXR0ZXIiLCJFdmVudEVtaXR0ZXIiLCJwcm9taXNlIiwiYnVpbGRQcm9taXNlIiwiZXhlY3V0ZSIsImh0dHBfcmVxdWVzdCIsImh0dHAiLCJsaXN0ZW5lciIsIkxpc3RlbmVyIiwib24iLCJvblJlc3BvbnNlIiwiYmluZCIsIm9uRXJyb3IiLCJ3cml0ZSIsImJvZHkiLCJlbmQiLCJSZXF1ZXN0IiwiaG9zdCIsImNsaWVudFZlcnNpb24iLCJsYW5ndWFnZVZlcnNpb24iLCJwcm9jZXNzIiwidmVyc2lvbnMiLCJub2RlIiwiYXBwSWQiLCJjdXN0b21BcHBJZCIsImFwcFZlcnNpb24iLCJjdXN0b21BcHBWZXJzaW9uIiwicG9ydCIsInNzbCIsImN1c3RvbUhlYWRlcnMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJlc3BvbnNlIiwiZXJyb3IiLCJsb2ciLCJkZWJ1ZyIsImxvZ2dlciIsInV0aWwiLCJpbnNwZWN0IiwibG9nTGV2ZWwiLCJ3YXJuIiwiX2RlZmF1bHQiLCJleHBvcnRzIiwibW9kdWxlIiwiZGVmYXVsdCJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hbWFkZXVzL2NsaWVudC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgdXRpbCAgICAgICAgIGZyb20gJ3V0aWwnO1xuXG5pbXBvcnQgQWNjZXNzVG9rZW4gZnJvbSAnLi9jbGllbnQvYWNjZXNzX3Rva2VuJztcbmltcG9ydCBMaXN0ZW5lciAgICBmcm9tICcuL2NsaWVudC9saXN0ZW5lcic7XG5pbXBvcnQgUmVxdWVzdCAgICAgZnJvbSAnLi9jbGllbnQvcmVxdWVzdCc7XG5pbXBvcnQgVmFsaWRhdG9yICAgZnJvbSAnLi9jbGllbnQvdmFsaWRhdG9yJztcblxuaW1wb3J0IHBrZyAgICAgICAgIGZyb20gJy4uLy4uL3BhY2thZ2UuanNvbic7XG5cbi8qKlxuICogQSBjb252ZW5pZW50IHdyYXBwZXIgYXJvdW5kIHRoZSBBUEksIGFsbG93aW5nIGZvciBnZW5lcmljLCBhdXRoZW50aWNhdGVkIGFuZFxuICogdW5hdXRoZW50aWNhdGVkIEFQSSBjYWxscyB3aXRob3V0IGhhdmluZyB0byBtYW5hZ2UgdGhlIHNlcmlhbGl6YXRpb24sXG4gKiBkZXNyaWFsaXphdGlvbiwgYW5kIGF1dGhlbnRpY2F0aW9uLlxuICpcbiAqIEdlbmVyYWxseSB5b3UgZG8gbm90IG5lZWQgdG8gdXNlIHRoaXMgb2JqZWN0IGRpcmVjdGx5LiBJbnN0ZWFkIGl0IGlzIHVzZWRcbiAqIGluZGlyZWN0bHkgYnkgdGhlIHZhcmlvdXMgbmFtZXNwYWNlZCBtZXRob2RzIGZvciBldmVyeSBBUEkgY2FsbC5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgdGhlIGZvbGxvd2luZyBhcmUgdGhlIHNlbWFudGljYWxseSB0aGUgc2FtZS5cbiAqXG4gKiBgYGBqc1xuICogYW1hZGV1cy5jbGllbnQuZ2V0KCcvdjEvcmVmZXJlbmNlLWRhdGEvdXJscy9jaGVja2luLWxpbmtzJywgcGFyYW1zKTtcbiAqIGFtYWRldXMuYW1hZGV1cy5yZWZlcmVuY2VfZGF0YS51cmxzLmNoZWNraW5fbGlua3MuZ2V0KHBhcmFtcyk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBhIGxpc3Qgb2Ygb3B0aW9ucy4gU2VlIHtAbGluayBBbWFkZXVzfSAuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gY2xpZW50SWQgdGhlIEFQSSBrZXkgdXNlZCB0byBhdXRoZW50aWNhdGUgdGhlIEFQSVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGNsaWVudFNlY3JldCB0aGUgQVBJIHNlY3JldCB1c2VkIHRvIGF1dGhlbnRpY2F0ZVxuICogIHRoZSBBUElcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBsb2dnZXIgdGhlIGBjb25zb2xlYC1jb21wYXRpYmxlIGxvZ2dlciB1c2VkIHRvIGRlYnVnIGNhbGxzXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbG9nTGV2ZWwgdGhlIGxvZyBsZXZlbCBmb3IgdGhlIGNsaWVudCwgYXZhaWxhYmxlIG9wdGlvbnNcbiAqICBhcmUgYGRlYnVnYCwgYHdhcm5gLCBhbmQgYHNpbGVudGAuIERlZmF1bHRzIHRvICdzaWxlbnQnXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaG9zdCB0aGUgaG9zdG5hbWUgb2YgdGhlIHNlcnZlciBBUEkgY2FsbHMgYXJlIG1hZGUgdG9cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBwb3J0IHRoZSBwb3J0IHRoZSBzZXJ2ZXIgQVBJIGNhbGxzIGFyZSBtYWRlIHRvXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IHNzbCB3ZXRoZXIgYW4gU1NMIHJlcXVlc3QgaXMgbWFkZSB0byB0aGUgc2VydmVyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gY3VzdG9tQXBwSWQgdGhlIGN1c3RvbSBBcHAgSUQgdG8gYmUgcGFzc2VkIGluIHRoZSBVc2VyXG4gKiAgQWdlbnQgdG8gdGhlIHNlcnZlclxuICogQHByb3BlcnR5IHtzdHJpbmd9IGN1c3RvbUFwcFZlcnNpb24gdGhlIGN1c3RvbSBBcHAgVmVyc2lvbiBudW1iZXIgdG8gYmVcbiAqICBwYXNzZWQgaW4gdGhlIFVzZXIgQWdlbnQgdG8gdGhlIHNlcnZlclxuICogQHByb3BlcnR5IHtPYmplY3R9IGh0dHAgdGhlIE5vZGUvSFRUUChTKS1jb21wYXRpYmxlIGNsaWVudCB1c2VkIHRvIG1ha2VcbiAqICByZXF1ZXN0c1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHZlcnNpb24gVGhlIHZlcnNpb24gb2YgdGhpcyBBUEkgY2xpZW50XG4gKi9cbmNsYXNzIENsaWVudCB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIG5ldyBWYWxpZGF0b3IoKS52YWxpZGF0ZUFuZEluaXRpYWxpemUodGhpcywgb3B0aW9ucyk7XG4gICAgdGhpcy5hY2Nlc3NUb2tlbiA9IG5ldyBBY2Nlc3NUb2tlbih0aGlzKTtcbiAgICB0aGlzLnZlcnNpb24gPSBwa2cudmVyc2lvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIGFuIGF1dGhlbnRpY2F0ZWQgR0VUIEFQSSBjYWxsLlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiBhbWFkZXVzLmNsaWVudC5nZXQoJy92Mi9mb28vYmFyJywgeyBzb21lOiAnZGF0YScgfSk7XG4gICAqIGBgYFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCB0aGUgZnVsbCBwYXRoIG9mIHRoZSBBUEkgZW5kcG9pbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXM9e31dIHRoZSBxdWVyeSBzdHJpbmcgcGFyYW1ldGVyc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxSZXNwb25zZSxSZXNwb25zZUVycm9yPn0gYSBQcm9taXNlXG4gICAqL1xuICBnZXQocGF0aCwgcGFyYW1zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KCdHRVQnLCBwYXRoLCBwYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYW4gYXV0aGVudGljYXRlZCBQT1NUIEFQSSBjYWxsLlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiBhbWFkZXVzLmNsaWVudC5wb3N0KCcvdjIvZm9vL2JhcicsIHsgc29tZTogJ2RhdGEnIH0pO1xuICAgKiBgYGBcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggdGhlIGZ1bGwgcGF0aCBvZiB0aGUgQVBJIGVuZHBvaW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zPXt9XSB0aGUgUE9TVCBwYXJhbWV0ZXJzXG4gICAqIEByZXR1cm4ge1Byb21pc2UuPFJlc3BvbnNlLFJlc3BvbnNlRXJyb3I+fSBhIFByb21pc2VcbiAgICovXG4gIHBvc3QocGF0aCwgcGFyYW1zID0ge30pIHtcbiAgICBjb25zdCBzdHJpbmdpZmllZFBhcmFtcyA9IHR5cGVvZiBwYXJhbXMgPT09ICdzdHJpbmcnID8gcGFyYW1zIDogSlNPTi5zdHJpbmdpZnkocGFyYW1zKTtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KCdQT1NUJywgcGF0aCwgc3RyaW5naWZpZWRQYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYW4gYXV0aGVudGljYXRlZCBQQVRDSCBBUEkgY2FsbC5cbiAgICpcbiAgICogYGBganNcbiAgICogYW1hZGV1cy5jbGllbnQucGF0Y2goJy92Mi9mb28vYmFyJywgeyBzb21lOiAnZGF0YScgfSk7XG4gICAqIGBgYFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCB0aGUgZnVsbCBwYXRoIG9mIHRoZSBBUEkgZW5kcG9pbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXM9e31dIHRoZSBQQVRDSCBwYXJhbWV0ZXJzXG4gICAqIEByZXR1cm4ge1Byb21pc2UuPFJlc3BvbnNlLFJlc3BvbnNlRXJyb3I+fSBhIFByb21pc2VcbiAgICovXG4gIHBhdGNoKHBhdGgsIHBhcmFtcyA9IHt9KSB7XG4gICAgY29uc3Qgc3RyaW5naWZpZWRQYXJhbXMgPSB0eXBlb2YgcGFyYW1zID09PSAnc3RyaW5nJyA/IHBhcmFtcyA6IEpTT04uc3RyaW5naWZ5KHBhcmFtcyk7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdCgnUEFUQ0gnLCBwYXRoLCBzdHJpbmdpZmllZFBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhbiBhdXRoZW50aWNhdGVkIERFTEVURSBBUEkgY2FsbC5cbiAgICpcbiAgICogYGBganNcbiAgICogYW1hZGV1cy5jbGllbnQuZGVsZXRlKCcvdjIvZm9vL2JhcicsIHsgc29tZTogJ2RhdGEnIH0pO1xuICAgKiBgYGBcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggdGhlIGZ1bGwgcGF0aCBvZiB0aGUgQVBJIGVuZHBvaW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zPXt9XSB0aGUgcXVlcnkgc3RyaW5nIHBhcmFtZXRlcnNcbiAgICogQHJldHVybiB7UHJvbWlzZS48UmVzcG9uc2UsUmVzcG9uc2VFcnJvcj59IGEgUHJvbWlzZVxuICAgKi9cbiAgZGVsZXRlKHBhdGgsIHBhcmFtcyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdCgnREVMRVRFJywgcGF0aCwgcGFyYW1zKTtcbiAgfVxuXG4gIC8vIFBST1RFQ1RFRFxuXG4gIC8qKlxuICAgKiBNYWtlIGFuIGF1dGhlbnRpY2F0ZWQgQVBJIGNhbGwuXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIGFtYWRldXMuY2xpZW50LmNhbGwoJ0dFVCcsICcvdjIvZm9vL2JhcicsIHsgc29tZTogJ2RhdGEnIH0pO1xuICAgKiBgYGBcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZlcmIgdGhlIEhUVFAgbWV0aG9kLCBmb3IgZXhhbXBsZSBgR0VUYCBvciBgUE9TVGBcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggdGhlIGZ1bGwgcGF0aCBvZiB0aGUgQVBJIGVuZHBvaW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zPXt9XSB0aGUgUE9TVCBwYXJhbWV0ZXJzXG4gICAqIEByZXR1cm4ge1Byb21pc2UuPFJlc3BvbnNlLFJlc3BvbnNlRXJyb3I+fSBhIFByb21pc2VcbiAgICogQHByb3RlY3RlZFxuICAgKi9cbiAgcmVxdWVzdCh2ZXJiLCBwYXRoLCBwYXJhbXMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmFjY2Vzc1Rva2VuLmJlYXJlclRva2VuKHRoaXMpLnRoZW4oKGJlYXJlclRva2VuKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy51bmF1dGhlbnRpY2F0ZWRSZXF1ZXN0KHZlcmIsIHBhdGgsIHBhcmFtcywgYmVhcmVyVG9rZW4pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gUFJJVkFURVxuXG4gIC8qKlxuICAgKiBNYWtlIGFueSBraW5kIG9mIEFQSSBjYWxsLCBhdXRoZW50aWNhdGVkIG9yIG5vdFxuICAgKlxuICAgKiBVc2VkIGJ5IHRoZSAuZ2V0LCAucG9zdCBtZXRob2RzIHRvIG1ha2UgQVBJIGNhbGxzLlxuICAgKlxuICAgKiBTZXRzIHVwIGEgbmV3IFByb21pc2UgYW5kIHRoZW4gZXhjdXRlcyB0aGUgQVBJIGNhbGwsIHRyaWdnZXJpbmcgdGhlIFByb21pc2VcbiAgICogdG8gYmUgY2FsbGVkIHdoZW4gdGhlIEFQSSBjYWxsIGZhaWxzIG9yIHN1Y2NlZWRzLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmVyYiB0aGUgSFRUUCBtZXRob2QsIGZvciBleGFtcGxlIGBHRVRgIG9yIGBQT1NUYFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCB0aGUgZnVsbCBwYXRoIG9mIHRoZSBBUEkgZW5kcG9pbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyB0aGUgcGFyYW1ldGVycyB0byBwYXNzIGluIHRoZSBxdWVyeSBvciBib2R5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbYmVhcmVyVG9rZW49bnVsbF0gdGhlIEJlYXJlclRva2VuIGFzIGdlbmVyYXRlZCBieSB0aGVcbiAgICogIEFjY2Vzc1Rva2VuIGNsYXNzXG4gICAqIEByZXR1cm4ge1Byb21pc2UuPFJlc3BvbnNlLFJlc3BvbnNlRXJyb3I+fSBhIFByb21pc2VcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHVuYXV0aGVudGljYXRlZFJlcXVlc3QodmVyYiwgcGF0aCwgcGFyYW1zLCBiZWFyZXJUb2tlbiA9IG51bGwpIHtcbiAgICBsZXQgcmVxdWVzdCA9IHRoaXMuYnVpbGRSZXF1ZXN0KHZlcmIsIHBhdGgsIHBhcmFtcywgYmVhcmVyVG9rZW4pO1xuICAgIGxldCBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIGxldCBwcm9taXNlID0gdGhpcy5idWlsZFByb21pc2UoZW1pdHRlcik7XG5cbiAgICB0aGlzLmV4ZWN1dGUocmVxdWVzdCwgZW1pdHRlcik7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogQWN0dWFsbHkgZXhlY3V0ZXMgdGhlIEFQSSBjYWxsLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlcXVlc3R9IHJlcXVlc3QgdGhlIHJlcXVlc3QgdG8gZXhlY3V0ZVxuICAgKiBAcGFyYW0ge0V2ZW50RW1pdHRlcn0gZW1pdHRlciB0aGUgZXZlbnQgZW1pdHRlciB0byBub3RpZnkgb2YgY2hhbmdlc1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZXhlY3V0ZShyZXF1ZXN0LCBlbWl0dGVyKSB7XG4gICAgbGV0IGh0dHBfcmVxdWVzdCA9IHRoaXMuaHR0cC5yZXF1ZXN0KHJlcXVlc3Qub3B0aW9ucygpKTtcbiAgICBsZXQgbGlzdGVuZXIgPSBuZXcgTGlzdGVuZXIocmVxdWVzdCwgZW1pdHRlciwgdGhpcyk7XG4gICAgaHR0cF9yZXF1ZXN0Lm9uKCdyZXNwb25zZScsIGxpc3RlbmVyLm9uUmVzcG9uc2UuYmluZChsaXN0ZW5lcikpO1xuICAgIGh0dHBfcmVxdWVzdC5vbignZXJyb3InLCAgICBsaXN0ZW5lci5vbkVycm9yLmJpbmQobGlzdGVuZXIpKTtcbiAgICBodHRwX3JlcXVlc3Qud3JpdGUocmVxdWVzdC5ib2R5KCkpO1xuICAgIGh0dHBfcmVxdWVzdC5lbmQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCdWlsZHMgYSBSZXF1ZXN0IG9iamVjdCB0byBiZSB1c2VkIGluIHRoZSBBUEkgY2FsbFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmVyYiB0aGUgSFRUUCBtZXRob2QsIGZvciBleGFtcGxlIGBHRVRgIG9yIGBQT1NUYFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCB0aGUgZnVsbCBwYXRoIG9mIHRoZSBBUEkgZW5kcG9pbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyB0aGUgcGFyYW1ldGVycyB0byBwYXNzIGluIHRoZSBxdWVyeSBvciBib2R5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbYmVhcmVyVG9rZW49bnVsbF0gdGhlIEJlYXJlclRva2VuIGFzIGdlbmVyYXRlZCBieSB0aGVcbiAgICogIEFjY2Vzc1Rva2VuIGNsYXNzXG4gICAqIEByZXR1cm4ge1JlcXVlc3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBidWlsZFJlcXVlc3QodmVyYiwgcGF0aCwgcGFyYW1zLCBiZWFyZXJUb2tlbikge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdCh7XG4gICAgICBob3N0OiB0aGlzLmhvc3QsXG4gICAgICB2ZXJiOiB2ZXJiLFxuICAgICAgcGF0aDogcGF0aCxcbiAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgYmVhcmVyVG9rZW46IGJlYXJlclRva2VuLFxuICAgICAgY2xpZW50VmVyc2lvbjogdGhpcy52ZXJzaW9uLFxuICAgICAgbGFuZ3VhZ2VWZXJzaW9uOiBwcm9jZXNzLnZlcnNpb25zLm5vZGUsXG4gICAgICBhcHBJZDogdGhpcy5jdXN0b21BcHBJZCxcbiAgICAgIGFwcFZlcnNpb246IHRoaXMuY3VzdG9tQXBwVmVyc2lvbixcbiAgICAgIHBvcnQ6IHRoaXMucG9ydCxcbiAgICAgIHNzbDogdGhpcy5zc2wsXG4gICAgICBjdXN0b21IZWFkZXJzOiB0aGlzLmN1c3RvbUhlYWRlcnNcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCdWlsZHMgYSBQcm9taXNlIHRvIGJlIHJldHVybmVkIHRvIHRoZSBBUEkgdXNlclxuICAgKlxuICAgKiBAcGFyYW0gIHt0eXBlfSBlbWl0dGVyIHRoZSBldmVudCBlbWl0dGVyIHRvIG5vdGlmeSBvZiBjaGFuZ2VzXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYnVpbGRQcm9taXNlKGVtaXR0ZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZW1pdHRlci5vbigncmVzb2x2ZScsIHJlc3BvbnNlID0+IHJlc29sdmUocmVzcG9uc2UpKTtcbiAgICAgIGVtaXR0ZXIub24oJ3JlamVjdCcsIGVycm9yID0+IHJlamVjdChlcnJvcikpO1xuICAgIH0pO1xuICB9XG5cblxuICAvKipcbiAgICogTG9ncyB0aGUgcmVxdWVzdCwgd2hlbiBpbiBkZWJ1ZyBtb2RlXG4gICAqXG4gICAqIEBwYXJhbSAge1JlcXVlc3R9IHJlcXVlc3QgdGhlIHJlcXVlc3Qgb2JqZWN0IHRvIGxvZ1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgbG9nKHJlcXVlc3QpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmKHRoaXMuZGVidWcoKSkgeyB0aGlzLmxvZ2dlci5sb2codXRpbC5pbnNwZWN0KHJlcXVlc3QsIGZhbHNlLCBudWxsKSk7IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGlmIHRoaXMgY2xpZW50IGlzIGluIGRlYnVnIG1vZGVcbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGRlYnVnKCkge1xuICAgIHJldHVybiB0aGlzLmxvZ0xldmVsID09ICdkZWJ1Zyc7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGlzIGNsaWVudCBpcyBpbiB3YXJuIG9yIGRlYnVnIG1vZGVcbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIHdhcm4oKSB7XG4gICAgcmV0dXJuIHRoaXMubG9nTGV2ZWwgPT0gJ3dhcm4nIHx8IHRoaXMuZGVidWcoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDbGllbnQ7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLE9BQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLEtBQUEsR0FBQUYsc0JBQUEsQ0FBQUMsT0FBQTtBQUVBLElBQUFFLGFBQUEsR0FBQUgsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFHLFNBQUEsR0FBQUosc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFJLFFBQUEsR0FBQUwsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFLLFVBQUEsR0FBQU4sc0JBQUEsQ0FBQUMsT0FBQTtBQUVBLElBQUFNLFFBQUEsR0FBQVAsc0JBQUEsQ0FBQUMsT0FBQTtBQUE2QyxTQUFBRCx1QkFBQVEsQ0FBQSxXQUFBQSxDQUFBLElBQUFBLENBQUEsQ0FBQUMsVUFBQSxHQUFBRCxDQUFBLGdCQUFBQSxDQUFBO0FBQUEsU0FBQUUsUUFBQUMsQ0FBQSxzQ0FBQUQsT0FBQSx3QkFBQUUsTUFBQSx1QkFBQUEsTUFBQSxDQUFBQyxRQUFBLGFBQUFGLENBQUEsa0JBQUFBLENBQUEsZ0JBQUFBLENBQUEsV0FBQUEsQ0FBQSx5QkFBQUMsTUFBQSxJQUFBRCxDQUFBLENBQUFHLFdBQUEsS0FBQUYsTUFBQSxJQUFBRCxDQUFBLEtBQUFDLE1BQUEsQ0FBQUcsU0FBQSxxQkFBQUos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