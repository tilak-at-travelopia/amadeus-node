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
      this.log(request);
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
      this.log(http_request);
      this.log(request.options());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXZlbnRzIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsInJlcXVpcmUiLCJfdXRpbCIsIl9hY2Nlc3NfdG9rZW4iLCJfbGlzdGVuZXIiLCJfcmVxdWVzdCIsIl92YWxpZGF0b3IiLCJfcGFja2FnZSIsImUiLCJfX2VzTW9kdWxlIiwiX3R5cGVvZiIsIm8iLCJTeW1ib2wiLCJpdGVyYXRvciIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiX2NsYXNzQ2FsbENoZWNrIiwiYSIsIm4iLCJUeXBlRXJyb3IiLCJfZGVmaW5lUHJvcGVydGllcyIsInIiLCJ0IiwibGVuZ3RoIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJfdG9Qcm9wZXJ0eUtleSIsImtleSIsIl9jcmVhdGVDbGFzcyIsImkiLCJfdG9QcmltaXRpdmUiLCJ0b1ByaW1pdGl2ZSIsImNhbGwiLCJTdHJpbmciLCJOdW1iZXIiLCJDbGllbnQiLCJvcHRpb25zIiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwiVmFsaWRhdG9yIiwidmFsaWRhdGVBbmRJbml0aWFsaXplIiwiYWNjZXNzVG9rZW4iLCJBY2Nlc3NUb2tlbiIsInZlcnNpb24iLCJwa2ciLCJ2YWx1ZSIsImdldCIsInBhdGgiLCJwYXJhbXMiLCJyZXF1ZXN0IiwicG9zdCIsInN0cmluZ2lmaWVkUGFyYW1zIiwiSlNPTiIsInN0cmluZ2lmeSIsImRlbGV0ZSIsInZlcmIiLCJfdGhpcyIsImJlYXJlclRva2VuIiwidGhlbiIsInVuYXV0aGVudGljYXRlZFJlcXVlc3QiLCJidWlsZFJlcXVlc3QiLCJsb2ciLCJlbWl0dGVyIiwiRXZlbnRFbWl0dGVyIiwicHJvbWlzZSIsImJ1aWxkUHJvbWlzZSIsImV4ZWN1dGUiLCJodHRwX3JlcXVlc3QiLCJodHRwIiwibGlzdGVuZXIiLCJMaXN0ZW5lciIsIm9uIiwib25SZXNwb25zZSIsImJpbmQiLCJvbkVycm9yIiwid3JpdGUiLCJib2R5IiwiZW5kIiwiUmVxdWVzdCIsImhvc3QiLCJjbGllbnRWZXJzaW9uIiwibGFuZ3VhZ2VWZXJzaW9uIiwicHJvY2VzcyIsInZlcnNpb25zIiwibm9kZSIsImFwcElkIiwiY3VzdG9tQXBwSWQiLCJhcHBWZXJzaW9uIiwiY3VzdG9tQXBwVmVyc2lvbiIsInBvcnQiLCJzc2wiLCJjdXN0b21IZWFkZXJzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXNwb25zZSIsImVycm9yIiwiZGVidWciLCJsb2dnZXIiLCJ1dGlsIiwiaW5zcGVjdCIsImxvZ0xldmVsIiwid2FybiIsIl9kZWZhdWx0IiwiZXhwb3J0cyIsIm1vZHVsZSIsImRlZmF1bHQiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvYW1hZGV1cy9jbGllbnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnO1xuaW1wb3J0IHV0aWwgICAgICAgICBmcm9tICd1dGlsJztcblxuaW1wb3J0IEFjY2Vzc1Rva2VuIGZyb20gJy4vY2xpZW50L2FjY2Vzc190b2tlbic7XG5pbXBvcnQgTGlzdGVuZXIgICAgZnJvbSAnLi9jbGllbnQvbGlzdGVuZXInO1xuaW1wb3J0IFJlcXVlc3QgICAgIGZyb20gJy4vY2xpZW50L3JlcXVlc3QnO1xuaW1wb3J0IFZhbGlkYXRvciAgIGZyb20gJy4vY2xpZW50L3ZhbGlkYXRvcic7XG5cbmltcG9ydCBwa2cgICAgICAgICBmcm9tICcuLi8uLi9wYWNrYWdlLmpzb24nO1xuXG4vKipcbiAqIEEgY29udmVuaWVudCB3cmFwcGVyIGFyb3VuZCB0aGUgQVBJLCBhbGxvd2luZyBmb3IgZ2VuZXJpYywgYXV0aGVudGljYXRlZCBhbmRcbiAqIHVuYXV0aGVudGljYXRlZCBBUEkgY2FsbHMgd2l0aG91dCBoYXZpbmcgdG8gbWFuYWdlIHRoZSBzZXJpYWxpemF0aW9uLFxuICogZGVzcmlhbGl6YXRpb24sIGFuZCBhdXRoZW50aWNhdGlvbi5cbiAqXG4gKiBHZW5lcmFsbHkgeW91IGRvIG5vdCBuZWVkIHRvIHVzZSB0aGlzIG9iamVjdCBkaXJlY3RseS4gSW5zdGVhZCBpdCBpcyB1c2VkXG4gKiBpbmRpcmVjdGx5IGJ5IHRoZSB2YXJpb3VzIG5hbWVzcGFjZWQgbWV0aG9kcyBmb3IgZXZlcnkgQVBJIGNhbGwuXG4gKlxuICogRm9yIGV4YW1wbGUsIHRoZSBmb2xsb3dpbmcgYXJlIHRoZSBzZW1hbnRpY2FsbHkgdGhlIHNhbWUuXG4gKlxuICogYGBganNcbiAqIGFtYWRldXMuY2xpZW50LmdldCgnL3YxL3JlZmVyZW5jZS1kYXRhL3VybHMvY2hlY2tpbi1saW5rcycsIHBhcmFtcyk7XG4gKiBhbWFkZXVzLmFtYWRldXMucmVmZXJlbmNlX2RhdGEudXJscy5jaGVja2luX2xpbmtzLmdldChwYXJhbXMpO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgYSBsaXN0IG9mIG9wdGlvbnMuIFNlZSB7QGxpbmsgQW1hZGV1c30gLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGNsaWVudElkIHRoZSBBUEkga2V5IHVzZWQgdG8gYXV0aGVudGljYXRlIHRoZSBBUElcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBjbGllbnRTZWNyZXQgdGhlIEFQSSBzZWNyZXQgdXNlZCB0byBhdXRoZW50aWNhdGVcbiAqICB0aGUgQVBJXG4gKiBAcHJvcGVydHkge09iamVjdH0gbG9nZ2VyIHRoZSBgY29uc29sZWAtY29tcGF0aWJsZSBsb2dnZXIgdXNlZCB0byBkZWJ1ZyBjYWxsc1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGxvZ0xldmVsIHRoZSBsb2cgbGV2ZWwgZm9yIHRoZSBjbGllbnQsIGF2YWlsYWJsZSBvcHRpb25zXG4gKiAgYXJlIGBkZWJ1Z2AsIGB3YXJuYCwgYW5kIGBzaWxlbnRgLiBEZWZhdWx0cyB0byAnc2lsZW50J1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGhvc3QgdGhlIGhvc3RuYW1lIG9mIHRoZSBzZXJ2ZXIgQVBJIGNhbGxzIGFyZSBtYWRlIHRvXG4gKiBAcHJvcGVydHkge251bWJlcn0gcG9ydCB0aGUgcG9ydCB0aGUgc2VydmVyIEFQSSBjYWxscyBhcmUgbWFkZSB0b1xuICogQHByb3BlcnR5IHtib29sZWFufSBzc2wgd2V0aGVyIGFuIFNTTCByZXF1ZXN0IGlzIG1hZGUgdG8gdGhlIHNlcnZlclxuICogQHByb3BlcnR5IHtzdHJpbmd9IGN1c3RvbUFwcElkIHRoZSBjdXN0b20gQXBwIElEIHRvIGJlIHBhc3NlZCBpbiB0aGUgVXNlclxuICogIEFnZW50IHRvIHRoZSBzZXJ2ZXJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBjdXN0b21BcHBWZXJzaW9uIHRoZSBjdXN0b20gQXBwIFZlcnNpb24gbnVtYmVyIHRvIGJlXG4gKiAgcGFzc2VkIGluIHRoZSBVc2VyIEFnZW50IHRvIHRoZSBzZXJ2ZXJcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBodHRwIHRoZSBOb2RlL0hUVFAoUyktY29tcGF0aWJsZSBjbGllbnQgdXNlZCB0byBtYWtlXG4gKiAgcmVxdWVzdHNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB2ZXJzaW9uIFRoZSB2ZXJzaW9uIG9mIHRoaXMgQVBJIGNsaWVudFxuICovXG5jbGFzcyBDbGllbnQge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBuZXcgVmFsaWRhdG9yKCkudmFsaWRhdGVBbmRJbml0aWFsaXplKHRoaXMsIG9wdGlvbnMpO1xuICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBuZXcgQWNjZXNzVG9rZW4odGhpcyk7XG4gICAgdGhpcy52ZXJzaW9uID0gcGtnLnZlcnNpb247XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhbiBhdXRoZW50aWNhdGVkIEdFVCBBUEkgY2FsbC5cbiAgICpcbiAgICogYGBganNcbiAgICogYW1hZGV1cy5jbGllbnQuZ2V0KCcvdjIvZm9vL2JhcicsIHsgc29tZTogJ2RhdGEnIH0pO1xuICAgKiBgYGBcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggdGhlIGZ1bGwgcGF0aCBvZiB0aGUgQVBJIGVuZHBvaW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zPXt9XSB0aGUgcXVlcnkgc3RyaW5nIHBhcmFtZXRlcnNcbiAgICogQHJldHVybiB7UHJvbWlzZS48UmVzcG9uc2UsUmVzcG9uc2VFcnJvcj59IGEgUHJvbWlzZVxuICAgKi9cbiAgZ2V0KHBhdGgsIHBhcmFtcyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdCgnR0VUJywgcGF0aCwgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIGFuIGF1dGhlbnRpY2F0ZWQgUE9TVCBBUEkgY2FsbC5cbiAgICpcbiAgICogYGBganNcbiAgICogYW1hZGV1cy5jbGllbnQucG9zdCgnL3YyL2Zvby9iYXInLCB7IHNvbWU6ICdkYXRhJyB9KTtcbiAgICogYGBgXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIHRoZSBmdWxsIHBhdGggb2YgdGhlIEFQSSBlbmRwb2ludFxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtcz17fV0gdGhlIFBPU1QgcGFyYW1ldGVyc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxSZXNwb25zZSxSZXNwb25zZUVycm9yPn0gYSBQcm9taXNlXG4gICAqL1xuICBwb3N0KHBhdGgsIHBhcmFtcyA9IHt9KSB7XG4gICAgY29uc3Qgc3RyaW5naWZpZWRQYXJhbXMgPSB0eXBlb2YgcGFyYW1zID09PSAnc3RyaW5nJyA/IHBhcmFtcyA6IEpTT04uc3RyaW5naWZ5KHBhcmFtcyk7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdCgnUE9TVCcsIHBhdGgsIHN0cmluZ2lmaWVkUGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIGFuIGF1dGhlbnRpY2F0ZWQgREVMRVRFIEFQSSBjYWxsLlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiBhbWFkZXVzLmNsaWVudC5kZWxldGUoJy92Mi9mb28vYmFyJywgeyBzb21lOiAnZGF0YScgfSk7XG4gICAqIGBgYFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCB0aGUgZnVsbCBwYXRoIG9mIHRoZSBBUEkgZW5kcG9pbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXM9e31dIHRoZSBxdWVyeSBzdHJpbmcgcGFyYW1ldGVyc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxSZXNwb25zZSxSZXNwb25zZUVycm9yPn0gYSBQcm9taXNlXG4gICAqL1xuICBkZWxldGUocGF0aCwgcGFyYW1zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KCdERUxFVEUnLCBwYXRoLCBwYXJhbXMpO1xuICB9XG5cbiAgLy8gUFJPVEVDVEVEXG5cbiAgLyoqXG4gICAqIE1ha2UgYW4gYXV0aGVudGljYXRlZCBBUEkgY2FsbC5cbiAgICpcbiAgICogYGBganNcbiAgICogYW1hZGV1cy5jbGllbnQuY2FsbCgnR0VUJywgJy92Mi9mb28vYmFyJywgeyBzb21lOiAnZGF0YScgfSk7XG4gICAqIGBgYFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmVyYiB0aGUgSFRUUCBtZXRob2QsIGZvciBleGFtcGxlIGBHRVRgIG9yIGBQT1NUYFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCB0aGUgZnVsbCBwYXRoIG9mIHRoZSBBUEkgZW5kcG9pbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXM9e31dIHRoZSBQT1NUIHBhcmFtZXRlcnNcbiAgICogQHJldHVybiB7UHJvbWlzZS48UmVzcG9uc2UsUmVzcG9uc2VFcnJvcj59IGEgUHJvbWlzZVxuICAgKiBAcHJvdGVjdGVkXG4gICAqL1xuICByZXF1ZXN0KHZlcmIsIHBhdGgsIHBhcmFtcyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuYWNjZXNzVG9rZW4uYmVhcmVyVG9rZW4odGhpcykudGhlbigoYmVhcmVyVG9rZW4pID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnVuYXV0aGVudGljYXRlZFJlcXVlc3QodmVyYiwgcGF0aCwgcGFyYW1zLCBiZWFyZXJUb2tlbik7XG4gICAgfSk7XG4gIH1cblxuICAvLyBQUklWQVRFXG5cbiAgLyoqXG4gICAqIE1ha2UgYW55IGtpbmQgb2YgQVBJIGNhbGwsIGF1dGhlbnRpY2F0ZWQgb3Igbm90XG4gICAqXG4gICAqIFVzZWQgYnkgdGhlIC5nZXQsIC5wb3N0IG1ldGhvZHMgdG8gbWFrZSBBUEkgY2FsbHMuXG4gICAqXG4gICAqIFNldHMgdXAgYSBuZXcgUHJvbWlzZSBhbmQgdGhlbiBleGN1dGVzIHRoZSBBUEkgY2FsbCwgdHJpZ2dlcmluZyB0aGUgUHJvbWlzZVxuICAgKiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgQVBJIGNhbGwgZmFpbHMgb3Igc3VjY2VlZHMuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2ZXJiIHRoZSBIVFRQIG1ldGhvZCwgZm9yIGV4YW1wbGUgYEdFVGAgb3IgYFBPU1RgXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIHRoZSBmdWxsIHBhdGggb2YgdGhlIEFQSSBlbmRwb2ludFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIHRoZSBwYXJhbWV0ZXJzIHRvIHBhc3MgaW4gdGhlIHF1ZXJ5IG9yIGJvZHlcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtiZWFyZXJUb2tlbj1udWxsXSB0aGUgQmVhcmVyVG9rZW4gYXMgZ2VuZXJhdGVkIGJ5IHRoZVxuICAgKiAgQWNjZXNzVG9rZW4gY2xhc3NcbiAgICogQHJldHVybiB7UHJvbWlzZS48UmVzcG9uc2UsUmVzcG9uc2VFcnJvcj59IGEgUHJvbWlzZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdW5hdXRoZW50aWNhdGVkUmVxdWVzdCh2ZXJiLCBwYXRoLCBwYXJhbXMsIGJlYXJlclRva2VuID0gbnVsbCkge1xuICAgIGxldCByZXF1ZXN0ID0gdGhpcy5idWlsZFJlcXVlc3QodmVyYiwgcGF0aCwgcGFyYW1zLCBiZWFyZXJUb2tlbik7XG4gICAgdGhpcy5sb2cocmVxdWVzdCk7XG4gICAgbGV0IGVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgbGV0IHByb21pc2UgPSB0aGlzLmJ1aWxkUHJvbWlzZShlbWl0dGVyKTtcblxuICAgIHRoaXMuZXhlY3V0ZShyZXF1ZXN0LCBlbWl0dGVyKTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBY3R1YWxseSBleGVjdXRlcyB0aGUgQVBJIGNhbGwuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVxdWVzdH0gcmVxdWVzdCB0aGUgcmVxdWVzdCB0byBleGVjdXRlXG4gICAqIEBwYXJhbSB7RXZlbnRFbWl0dGVyfSBlbWl0dGVyIHRoZSBldmVudCBlbWl0dGVyIHRvIG5vdGlmeSBvZiBjaGFuZ2VzXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBleGVjdXRlKHJlcXVlc3QsIGVtaXR0ZXIpIHtcbiAgICBsZXQgaHR0cF9yZXF1ZXN0ID0gdGhpcy5odHRwLnJlcXVlc3QocmVxdWVzdC5vcHRpb25zKCkpO1xuICAgIHRoaXMubG9nKGh0dHBfcmVxdWVzdCk7XG4gICAgdGhpcy5sb2cocmVxdWVzdC5vcHRpb25zKCkpO1xuICAgIGxldCBsaXN0ZW5lciA9IG5ldyBMaXN0ZW5lcihyZXF1ZXN0LCBlbWl0dGVyLCB0aGlzKTtcbiAgICBodHRwX3JlcXVlc3Qub24oJ3Jlc3BvbnNlJywgbGlzdGVuZXIub25SZXNwb25zZS5iaW5kKGxpc3RlbmVyKSk7XG4gICAgaHR0cF9yZXF1ZXN0Lm9uKCdlcnJvcicsICAgIGxpc3RlbmVyLm9uRXJyb3IuYmluZChsaXN0ZW5lcikpO1xuICAgIGh0dHBfcmVxdWVzdC53cml0ZShyZXF1ZXN0LmJvZHkoKSk7XG4gICAgaHR0cF9yZXF1ZXN0LmVuZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkcyBhIFJlcXVlc3Qgb2JqZWN0IHRvIGJlIHVzZWQgaW4gdGhlIEFQSSBjYWxsXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2ZXJiIHRoZSBIVFRQIG1ldGhvZCwgZm9yIGV4YW1wbGUgYEdFVGAgb3IgYFBPU1RgXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIHRoZSBmdWxsIHBhdGggb2YgdGhlIEFQSSBlbmRwb2ludFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIHRoZSBwYXJhbWV0ZXJzIHRvIHBhc3MgaW4gdGhlIHF1ZXJ5IG9yIGJvZHlcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtiZWFyZXJUb2tlbj1udWxsXSB0aGUgQmVhcmVyVG9rZW4gYXMgZ2VuZXJhdGVkIGJ5IHRoZVxuICAgKiAgQWNjZXNzVG9rZW4gY2xhc3NcbiAgICogQHJldHVybiB7UmVxdWVzdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGJ1aWxkUmVxdWVzdCh2ZXJiLCBwYXRoLCBwYXJhbXMsIGJlYXJlclRva2VuKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0KHtcbiAgICAgIGhvc3Q6IHRoaXMuaG9zdCxcbiAgICAgIHZlcmI6IHZlcmIsXG4gICAgICBwYXRoOiBwYXRoLFxuICAgICAgcGFyYW1zOiBwYXJhbXMsXG4gICAgICBiZWFyZXJUb2tlbjogYmVhcmVyVG9rZW4sXG4gICAgICBjbGllbnRWZXJzaW9uOiB0aGlzLnZlcnNpb24sXG4gICAgICBsYW5ndWFnZVZlcnNpb246IHByb2Nlc3MudmVyc2lvbnMubm9kZSxcbiAgICAgIGFwcElkOiB0aGlzLmN1c3RvbUFwcElkLFxuICAgICAgYXBwVmVyc2lvbjogdGhpcy5jdXN0b21BcHBWZXJzaW9uLFxuICAgICAgcG9ydDogdGhpcy5wb3J0LFxuICAgICAgc3NsOiB0aGlzLnNzbCxcbiAgICAgIGN1c3RvbUhlYWRlcnM6IHRoaXMuY3VzdG9tSGVhZGVyc1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkcyBhIFByb21pc2UgdG8gYmUgcmV0dXJuZWQgdG8gdGhlIEFQSSB1c2VyXG4gICAqXG4gICAqIEBwYXJhbSAge3R5cGV9IGVtaXR0ZXIgdGhlIGV2ZW50IGVtaXR0ZXIgdG8gbm90aWZ5IG9mIGNoYW5nZXNcbiAgICogQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBidWlsZFByb21pc2UoZW1pdHRlcikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBlbWl0dGVyLm9uKCdyZXNvbHZlJywgcmVzcG9uc2UgPT4gcmVzb2x2ZShyZXNwb25zZSkpO1xuICAgICAgZW1pdHRlci5vbigncmVqZWN0JywgZXJyb3IgPT4gcmVqZWN0KGVycm9yKSk7XG4gICAgfSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBMb2dzIHRoZSByZXF1ZXN0LCB3aGVuIGluIGRlYnVnIG1vZGVcbiAgICpcbiAgICogQHBhcmFtICB7UmVxdWVzdH0gcmVxdWVzdCB0aGUgcmVxdWVzdCBvYmplY3QgdG8gbG9nXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBsb2cocmVxdWVzdCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYodGhpcy5kZWJ1ZygpKSB7IHRoaXMubG9nZ2VyLmxvZyh1dGlsLmluc3BlY3QocmVxdWVzdCwgZmFsc2UsIG51bGwpKTsgfVxuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgdGhpcyBjbGllbnQgaXMgaW4gZGVidWcgbW9kZVxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgZGVidWcoKSB7XG4gICAgcmV0dXJuIHRoaXMubG9nTGV2ZWwgPT0gJ2RlYnVnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGlmIHRoaXMgY2xpZW50IGlzIGluIHdhcm4gb3IgZGVidWcgbW9kZVxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgd2FybigpIHtcbiAgICByZXR1cm4gdGhpcy5sb2dMZXZlbCA9PSAnd2FybicgfHwgdGhpcy5kZWJ1ZygpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENsaWVudDtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsT0FBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsS0FBQSxHQUFBRixzQkFBQSxDQUFBQyxPQUFBO0FBRUEsSUFB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