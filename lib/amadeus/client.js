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
      // Log the request details
      if (this.debug()) {
        this.logger.log('Request:');
        this.logger.log("".concat(request.verb, " ").concat(request.path));
        this.logger.log('Headers:', request.options().headers);

        // Log request body
        var body = request.body();
        if (body) {
          this.logger.log('Body:', body);
        }
        if (request.params && Object.keys(request.params).length > 0) {
          this.logger.log('Params:', request.params);
        }
      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXZlbnRzIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsInJlcXVpcmUiLCJfdXRpbCIsIl9hY2Nlc3NfdG9rZW4iLCJfbGlzdGVuZXIiLCJfcmVxdWVzdCIsIl92YWxpZGF0b3IiLCJfcGFja2FnZSIsImUiLCJfX2VzTW9kdWxlIiwiX3R5cGVvZiIsIm8iLCJTeW1ib2wiLCJpdGVyYXRvciIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiX2NsYXNzQ2FsbENoZWNrIiwiYSIsIm4iLCJUeXBlRXJyb3IiLCJfZGVmaW5lUHJvcGVydGllcyIsInIiLCJ0IiwibGVuZ3RoIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJfdG9Qcm9wZXJ0eUtleSIsImtleSIsIl9jcmVhdGVDbGFzcyIsImkiLCJfdG9QcmltaXRpdmUiLCJ0b1ByaW1pdGl2ZSIsImNhbGwiLCJTdHJpbmciLCJOdW1iZXIiLCJDbGllbnQiLCJvcHRpb25zIiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwiVmFsaWRhdG9yIiwidmFsaWRhdGVBbmRJbml0aWFsaXplIiwiYWNjZXNzVG9rZW4iLCJBY2Nlc3NUb2tlbiIsInZlcnNpb24iLCJwa2ciLCJ2YWx1ZSIsImdldCIsInBhdGgiLCJwYXJhbXMiLCJyZXF1ZXN0IiwicG9zdCIsInN0cmluZ2lmaWVkUGFyYW1zIiwiSlNPTiIsInN0cmluZ2lmeSIsInBhdGNoIiwiZGVsZXRlIiwidmVyYiIsIl90aGlzIiwiYmVhcmVyVG9rZW4iLCJ0aGVuIiwidW5hdXRoZW50aWNhdGVkUmVxdWVzdCIsImJ1aWxkUmVxdWVzdCIsImVtaXR0ZXIiLCJFdmVudEVtaXR0ZXIiLCJwcm9taXNlIiwiYnVpbGRQcm9taXNlIiwiZXhlY3V0ZSIsImRlYnVnIiwibG9nZ2VyIiwibG9nIiwiY29uY2F0IiwiaGVhZGVycyIsImJvZHkiLCJrZXlzIiwiaHR0cF9yZXF1ZXN0IiwiaHR0cCIsImxpc3RlbmVyIiwiTGlzdGVuZXIiLCJvbiIsIm9uUmVzcG9uc2UiLCJiaW5kIiwib25FcnJvciIsIndyaXRlIiwiZW5kIiwiUmVxdWVzdCIsImhvc3QiLCJjbGllbnRWZXJzaW9uIiwibGFuZ3VhZ2VWZXJzaW9uIiwicHJvY2VzcyIsInZlcnNpb25zIiwibm9kZSIsImFwcElkIiwiY3VzdG9tQXBwSWQiLCJhcHBWZXJzaW9uIiwiY3VzdG9tQXBwVmVyc2lvbiIsInBvcnQiLCJzc2wiLCJjdXN0b21IZWFkZXJzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXNwb25zZSIsImVycm9yIiwidXRpbCIsImluc3BlY3QiLCJsb2dMZXZlbCIsIndhcm4iLCJfZGVmYXVsdCIsImV4cG9ydHMiLCJtb2R1bGUiLCJkZWZhdWx0Il0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FtYWRldXMvY2xpZW50LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcbmltcG9ydCB1dGlsICAgICAgICAgZnJvbSAndXRpbCc7XG5cbmltcG9ydCBBY2Nlc3NUb2tlbiBmcm9tICcuL2NsaWVudC9hY2Nlc3NfdG9rZW4nO1xuaW1wb3J0IExpc3RlbmVyICAgIGZyb20gJy4vY2xpZW50L2xpc3RlbmVyJztcbmltcG9ydCBSZXF1ZXN0ICAgICBmcm9tICcuL2NsaWVudC9yZXF1ZXN0JztcbmltcG9ydCBWYWxpZGF0b3IgICBmcm9tICcuL2NsaWVudC92YWxpZGF0b3InO1xuXG5pbXBvcnQgcGtnICAgICAgICAgZnJvbSAnLi4vLi4vcGFja2FnZS5qc29uJztcblxuLyoqXG4gKiBBIGNvbnZlbmllbnQgd3JhcHBlciBhcm91bmQgdGhlIEFQSSwgYWxsb3dpbmcgZm9yIGdlbmVyaWMsIGF1dGhlbnRpY2F0ZWQgYW5kXG4gKiB1bmF1dGhlbnRpY2F0ZWQgQVBJIGNhbGxzIHdpdGhvdXQgaGF2aW5nIHRvIG1hbmFnZSB0aGUgc2VyaWFsaXphdGlvbixcbiAqIGRlc3JpYWxpemF0aW9uLCBhbmQgYXV0aGVudGljYXRpb24uXG4gKlxuICogR2VuZXJhbGx5IHlvdSBkbyBub3QgbmVlZCB0byB1c2UgdGhpcyBvYmplY3QgZGlyZWN0bHkuIEluc3RlYWQgaXQgaXMgdXNlZFxuICogaW5kaXJlY3RseSBieSB0aGUgdmFyaW91cyBuYW1lc3BhY2VkIG1ldGhvZHMgZm9yIGV2ZXJ5IEFQSSBjYWxsLlxuICpcbiAqIEZvciBleGFtcGxlLCB0aGUgZm9sbG93aW5nIGFyZSB0aGUgc2VtYW50aWNhbGx5IHRoZSBzYW1lLlxuICpcbiAqIGBgYGpzXG4gKiBhbWFkZXVzLmNsaWVudC5nZXQoJy92MS9yZWZlcmVuY2UtZGF0YS91cmxzL2NoZWNraW4tbGlua3MnLCBwYXJhbXMpO1xuICogYW1hZGV1cy5hbWFkZXVzLnJlZmVyZW5jZV9kYXRhLnVybHMuY2hlY2tpbl9saW5rcy5nZXQocGFyYW1zKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIGEgbGlzdCBvZiBvcHRpb25zLiBTZWUge0BsaW5rIEFtYWRldXN9IC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBjbGllbnRJZCB0aGUgQVBJIGtleSB1c2VkIHRvIGF1dGhlbnRpY2F0ZSB0aGUgQVBJXG4gKiBAcHJvcGVydHkge3N0cmluZ30gY2xpZW50U2VjcmV0IHRoZSBBUEkgc2VjcmV0IHVzZWQgdG8gYXV0aGVudGljYXRlXG4gKiAgdGhlIEFQSVxuICogQHByb3BlcnR5IHtPYmplY3R9IGxvZ2dlciB0aGUgYGNvbnNvbGVgLWNvbXBhdGlibGUgbG9nZ2VyIHVzZWQgdG8gZGVidWcgY2FsbHNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBsb2dMZXZlbCB0aGUgbG9nIGxldmVsIGZvciB0aGUgY2xpZW50LCBhdmFpbGFibGUgb3B0aW9uc1xuICogIGFyZSBgZGVidWdgLCBgd2FybmAsIGFuZCBgc2lsZW50YC4gRGVmYXVsdHMgdG8gJ3NpbGVudCdcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBob3N0IHRoZSBob3N0bmFtZSBvZiB0aGUgc2VydmVyIEFQSSBjYWxscyBhcmUgbWFkZSB0b1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHBvcnQgdGhlIHBvcnQgdGhlIHNlcnZlciBBUEkgY2FsbHMgYXJlIG1hZGUgdG9cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gc3NsIHdldGhlciBhbiBTU0wgcmVxdWVzdCBpcyBtYWRlIHRvIHRoZSBzZXJ2ZXJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBjdXN0b21BcHBJZCB0aGUgY3VzdG9tIEFwcCBJRCB0byBiZSBwYXNzZWQgaW4gdGhlIFVzZXJcbiAqICBBZ2VudCB0byB0aGUgc2VydmVyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gY3VzdG9tQXBwVmVyc2lvbiB0aGUgY3VzdG9tIEFwcCBWZXJzaW9uIG51bWJlciB0byBiZVxuICogIHBhc3NlZCBpbiB0aGUgVXNlciBBZ2VudCB0byB0aGUgc2VydmVyXG4gKiBAcHJvcGVydHkge09iamVjdH0gaHR0cCB0aGUgTm9kZS9IVFRQKFMpLWNvbXBhdGlibGUgY2xpZW50IHVzZWQgdG8gbWFrZVxuICogIHJlcXVlc3RzXG4gKiBAcHJvcGVydHkge251bWJlcn0gdmVyc2lvbiBUaGUgdmVyc2lvbiBvZiB0aGlzIEFQSSBjbGllbnRcbiAqL1xuY2xhc3MgQ2xpZW50IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgbmV3IFZhbGlkYXRvcigpLnZhbGlkYXRlQW5kSW5pdGlhbGl6ZSh0aGlzLCBvcHRpb25zKTtcbiAgICB0aGlzLmFjY2Vzc1Rva2VuID0gbmV3IEFjY2Vzc1Rva2VuKHRoaXMpO1xuICAgIHRoaXMudmVyc2lvbiA9IHBrZy52ZXJzaW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYW4gYXV0aGVudGljYXRlZCBHRVQgQVBJIGNhbGwuXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIGFtYWRldXMuY2xpZW50LmdldCgnL3YyL2Zvby9iYXInLCB7IHNvbWU6ICdkYXRhJyB9KTtcbiAgICogYGBgXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIHRoZSBmdWxsIHBhdGggb2YgdGhlIEFQSSBlbmRwb2ludFxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtcz17fV0gdGhlIHF1ZXJ5IHN0cmluZyBwYXJhbWV0ZXJzXG4gICAqIEByZXR1cm4ge1Byb21pc2UuPFJlc3BvbnNlLFJlc3BvbnNlRXJyb3I+fSBhIFByb21pc2VcbiAgICovXG4gIGdldChwYXRoLCBwYXJhbXMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoJ0dFVCcsIHBhdGgsIHBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhbiBhdXRoZW50aWNhdGVkIFBPU1QgQVBJIGNhbGwuXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIGFtYWRldXMuY2xpZW50LnBvc3QoJy92Mi9mb28vYmFyJywgeyBzb21lOiAnZGF0YScgfSk7XG4gICAqIGBgYFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCB0aGUgZnVsbCBwYXRoIG9mIHRoZSBBUEkgZW5kcG9pbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXM9e31dIHRoZSBQT1NUIHBhcmFtZXRlcnNcbiAgICogQHJldHVybiB7UHJvbWlzZS48UmVzcG9uc2UsUmVzcG9uc2VFcnJvcj59IGEgUHJvbWlzZVxuICAgKi9cbiAgcG9zdChwYXRoLCBwYXJhbXMgPSB7fSkge1xuICAgIGNvbnN0IHN0cmluZ2lmaWVkUGFyYW1zID1cbiAgICAgIHR5cGVvZiBwYXJhbXMgPT09ICdzdHJpbmcnID8gcGFyYW1zIDogSlNPTi5zdHJpbmdpZnkocGFyYW1zKTtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KCdQT1NUJywgcGF0aCwgc3RyaW5naWZpZWRQYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYW4gYXV0aGVudGljYXRlZCBQQVRDSCBBUEkgY2FsbC5cbiAgICpcbiAgICogYGBganNcbiAgICogYW1hZGV1cy5jbGllbnQucGF0Y2goJy92Mi9mb28vYmFyJywgeyBzb21lOiAnZGF0YScgfSk7XG4gICAqIGBgYFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCB0aGUgZnVsbCBwYXRoIG9mIHRoZSBBUEkgZW5kcG9pbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXM9e31dIHRoZSBQQVRDSCBwYXJhbWV0ZXJzXG4gICAqIEByZXR1cm4ge1Byb21pc2UuPFJlc3BvbnNlLFJlc3BvbnNlRXJyb3I+fSBhIFByb21pc2VcbiAgICovXG4gIHBhdGNoKHBhdGgsIHBhcmFtcyA9IHt9KSB7XG4gICAgY29uc3Qgc3RyaW5naWZpZWRQYXJhbXMgPVxuICAgICAgdHlwZW9mIHBhcmFtcyA9PT0gJ3N0cmluZycgPyBwYXJhbXMgOiBKU09OLnN0cmluZ2lmeShwYXJhbXMpO1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoJ1BBVENIJywgcGF0aCwgc3RyaW5naWZpZWRQYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYW4gYXV0aGVudGljYXRlZCBERUxFVEUgQVBJIGNhbGwuXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIGFtYWRldXMuY2xpZW50LmRlbGV0ZSgnL3YyL2Zvby9iYXInLCB7IHNvbWU6ICdkYXRhJyB9KTtcbiAgICogYGBgXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIHRoZSBmdWxsIHBhdGggb2YgdGhlIEFQSSBlbmRwb2ludFxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtcz17fV0gdGhlIHF1ZXJ5IHN0cmluZyBwYXJhbWV0ZXJzXG4gICAqIEByZXR1cm4ge1Byb21pc2UuPFJlc3BvbnNlLFJlc3BvbnNlRXJyb3I+fSBhIFByb21pc2VcbiAgICovXG4gIGRlbGV0ZShwYXRoLCBwYXJhbXMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoJ0RFTEVURScsIHBhdGgsIHBhcmFtcyk7XG4gIH1cblxuICAvLyBQUk9URUNURURcblxuICAvKipcbiAgICogTWFrZSBhbiBhdXRoZW50aWNhdGVkIEFQSSBjYWxsLlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiBhbWFkZXVzLmNsaWVudC5jYWxsKCdHRVQnLCAnL3YyL2Zvby9iYXInLCB7IHNvbWU6ICdkYXRhJyB9KTtcbiAgICogYGBgXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2ZXJiIHRoZSBIVFRQIG1ldGhvZCwgZm9yIGV4YW1wbGUgYEdFVGAgb3IgYFBPU1RgXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIHRoZSBmdWxsIHBhdGggb2YgdGhlIEFQSSBlbmRwb2ludFxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtcz17fV0gdGhlIFBPU1QgcGFyYW1ldGVyc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxSZXNwb25zZSxSZXNwb25zZUVycm9yPn0gYSBQcm9taXNlXG4gICAqIEBwcm90ZWN0ZWRcbiAgICovXG4gIHJlcXVlc3QodmVyYiwgcGF0aCwgcGFyYW1zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5hY2Nlc3NUb2tlbi5iZWFyZXJUb2tlbih0aGlzKS50aGVuKChiZWFyZXJUb2tlbikgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMudW5hdXRoZW50aWNhdGVkUmVxdWVzdCh2ZXJiLCBwYXRoLCBwYXJhbXMsIGJlYXJlclRva2VuKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFBSSVZBVEVcblxuICAvKipcbiAgICogTWFrZSBhbnkga2luZCBvZiBBUEkgY2FsbCwgYXV0aGVudGljYXRlZCBvciBub3RcbiAgICpcbiAgICogVXNlZCBieSB0aGUgLmdldCwgLnBvc3QgbWV0aG9kcyB0byBtYWtlIEFQSSBjYWxscy5cbiAgICpcbiAgICogU2V0cyB1cCBhIG5ldyBQcm9taXNlIGFuZCB0aGVuIGV4Y3V0ZXMgdGhlIEFQSSBjYWxsLCB0cmlnZ2VyaW5nIHRoZSBQcm9taXNlXG4gICAqIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBBUEkgY2FsbCBmYWlscyBvciBzdWNjZWVkcy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZlcmIgdGhlIEhUVFAgbWV0aG9kLCBmb3IgZXhhbXBsZSBgR0VUYCBvciBgUE9TVGBcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggdGhlIGZ1bGwgcGF0aCBvZiB0aGUgQVBJIGVuZHBvaW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgdGhlIHBhcmFtZXRlcnMgdG8gcGFzcyBpbiB0aGUgcXVlcnkgb3IgYm9keVxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2JlYXJlclRva2VuPW51bGxdIHRoZSBCZWFyZXJUb2tlbiBhcyBnZW5lcmF0ZWQgYnkgdGhlXG4gICAqICBBY2Nlc3NUb2tlbiBjbGFzc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxSZXNwb25zZSxSZXNwb25zZUVycm9yPn0gYSBQcm9taXNlXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB1bmF1dGhlbnRpY2F0ZWRSZXF1ZXN0KHZlcmIsIHBhdGgsIHBhcmFtcywgYmVhcmVyVG9rZW4gPSBudWxsKSB7XG4gICAgbGV0IHJlcXVlc3QgPSB0aGlzLmJ1aWxkUmVxdWVzdCh2ZXJiLCBwYXRoLCBwYXJhbXMsIGJlYXJlclRva2VuKTtcbiAgICBsZXQgZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBsZXQgcHJvbWlzZSA9IHRoaXMuYnVpbGRQcm9taXNlKGVtaXR0ZXIpO1xuXG4gICAgdGhpcy5leGVjdXRlKHJlcXVlc3QsIGVtaXR0ZXIpO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFjdHVhbGx5IGV4ZWN1dGVzIHRoZSBBUEkgY2FsbC5cbiAgICpcbiAgICogQHBhcmFtIHtSZXF1ZXN0fSByZXF1ZXN0IHRoZSByZXF1ZXN0IHRvIGV4ZWN1dGVcbiAgICogQHBhcmFtIHtFdmVudEVtaXR0ZXJ9IGVtaXR0ZXIgdGhlIGV2ZW50IGVtaXR0ZXIgdG8gbm90aWZ5IG9mIGNoYW5nZXNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGV4ZWN1dGUocmVxdWVzdCwgZW1pdHRlcikge1xuICAgIC8vIExvZyB0aGUgcmVxdWVzdCBkZXRhaWxzXG4gICAgaWYgKHRoaXMuZGVidWcoKSkge1xuICAgICAgdGhpcy5sb2dnZXIubG9nKCdSZXF1ZXN0OicpO1xuICAgICAgdGhpcy5sb2dnZXIubG9nKGAke3JlcXVlc3QudmVyYn0gJHtyZXF1ZXN0LnBhdGh9YCk7XG4gICAgICB0aGlzLmxvZ2dlci5sb2coJ0hlYWRlcnM6JywgcmVxdWVzdC5vcHRpb25zKCkuaGVhZGVycyk7XG5cbiAgICAgIC8vIExvZyByZXF1ZXN0IGJvZHlcbiAgICAgIGNvbnN0IGJvZHkgPSByZXF1ZXN0LmJvZHkoKTtcbiAgICAgIGlmIChib2R5KSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZygnQm9keTonLCBib2R5KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlcXVlc3QucGFyYW1zICYmIE9iamVjdC5rZXlzKHJlcXVlc3QucGFyYW1zKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZygnUGFyYW1zOicsIHJlcXVlc3QucGFyYW1zKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgaHR0cF9yZXF1ZXN0ID0gdGhpcy5odHRwLnJlcXVlc3QocmVxdWVzdC5vcHRpb25zKCkpO1xuICAgIGxldCBsaXN0ZW5lciA9IG5ldyBMaXN0ZW5lcihyZXF1ZXN0LCBlbWl0dGVyLCB0aGlzKTtcbiAgICBodHRwX3JlcXVlc3Qub24oJ3Jlc3BvbnNlJywgbGlzdGVuZXIub25SZXNwb25zZS5iaW5kKGxpc3RlbmVyKSk7XG4gICAgaHR0cF9yZXF1ZXN0Lm9uKCdlcnJvcicsIGxpc3RlbmVyLm9uRXJyb3IuYmluZChsaXN0ZW5lcikpO1xuICAgIGh0dHBfcmVxdWVzdC53cml0ZShyZXF1ZXN0LmJvZHkoKSk7XG4gICAgaHR0cF9yZXF1ZXN0LmVuZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkcyBhIFJlcXVlc3Qgb2JqZWN0IHRvIGJlIHVzZWQgaW4gdGhlIEFQSSBjYWxsXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2ZXJiIHRoZSBIVFRQIG1ldGhvZCwgZm9yIGV4YW1wbGUgYEdFVGAgb3IgYFBPU1RgXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIHRoZSBmdWxsIHBhdGggb2YgdGhlIEFQSSBlbmRwb2ludFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIHRoZSBwYXJhbWV0ZXJzIHRvIHBhc3MgaW4gdGhlIHF1ZXJ5IG9yIGJvZHlcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtiZWFyZXJUb2tlbj1udWxsXSB0aGUgQmVhcmVyVG9rZW4gYXMgZ2VuZXJhdGVkIGJ5IHRoZVxuICAgKiAgQWNjZXNzVG9rZW4gY2xhc3NcbiAgICogQHJldHVybiB7UmVxdWVzdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGJ1aWxkUmVxdWVzdCh2ZXJiLCBwYXRoLCBwYXJhbXMsIGJlYXJlclRva2VuKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0KHtcbiAgICAgIGhvc3Q6IHRoaXMuaG9zdCxcbiAgICAgIHZlcmI6IHZlcmIsXG4gICAgICBwYXRoOiBwYXRoLFxuICAgICAgcGFyYW1zOiBwYXJhbXMsXG4gICAgICBiZWFyZXJUb2tlbjogYmVhcmVyVG9rZW4sXG4gICAgICBjbGllbnRWZXJzaW9uOiB0aGlzLnZlcnNpb24sXG4gICAgICBsYW5ndWFnZVZlcnNpb246IHByb2Nlc3MudmVyc2lvbnMubm9kZSxcbiAgICAgIGFwcElkOiB0aGlzLmN1c3RvbUFwcElkLFxuICAgICAgYXBwVmVyc2lvbjogdGhpcy5jdXN0b21BcHBWZXJzaW9uLFxuICAgICAgcG9ydDogdGhpcy5wb3J0LFxuICAgICAgc3NsOiB0aGlzLnNzbCxcbiAgICAgIGN1c3RvbUhlYWRlcnM6IHRoaXMuY3VzdG9tSGVhZGVycyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCdWlsZHMgYSBQcm9taXNlIHRvIGJlIHJldHVybmVkIHRvIHRoZSBBUEkgdXNlclxuICAgKlxuICAgKiBAcGFyYW0gIHt0eXBlfSBlbWl0dGVyIHRoZSBldmVudCBlbWl0dGVyIHRvIG5vdGlmeSBvZiBjaGFuZ2VzXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYnVpbGRQcm9taXNlKGVtaXR0ZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZW1pdHRlci5vbigncmVzb2x2ZScsIHJlc3BvbnNlID0+IHJlc29sdmUocmVzcG9uc2UpKTtcbiAgICAgIGVtaXR0ZXIub24oJ3JlamVjdCcsIGVycm9yID0+IHJlamVjdChlcnJvcikpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExvZ3MgdGhlIHJlcXVlc3QsIHdoZW4gaW4gZGVidWcgbW9kZVxuICAgKlxuICAgKiBAcGFyYW0gIHtSZXF1ZXN0fSByZXF1ZXN0IHRoZSByZXF1ZXN0IG9iamVjdCB0byBsb2dcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGxvZyhyZXF1ZXN0KSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZih0aGlzLmRlYnVnKCkpIHsgdGhpcy5sb2dnZXIubG9nKHV0aWwuaW5zcGVjdChyZXF1ZXN0LCBmYWxzZSwgbnVsbCkpOyB9XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGlzIGNsaWVudCBpcyBpbiBkZWJ1ZyBtb2RlXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBkZWJ1ZygpIHtcbiAgICByZXR1cm4gdGhpcy5sb2dMZXZlbCA9PSAnZGVidWcnO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgdGhpcyBjbGllbnQgaXMgaW4gd2FybiBvciBkZWJ1ZyBtb2RlXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICB3YXJuKCkge1xuICAgIHJldHVybiB0aGlzLmxvZ0xldmVsID09ICd3YXJuJyB8fCB0aGlzLmRlYnVnKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxPQUFBLEdBQUFDLHNC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