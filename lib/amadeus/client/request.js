"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _qs = _interopRequireDefault(require("qs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * A Request object containing all the compiled information about this request.
 *
 * @property {string} host the host used for this API call
 * @property {number} port the port for this API call. Standard set to 443.
 * @property {boolean} ssl wether this API call uses SSL
 * @property {string} scheme the scheme inferred from the SSL state
 * @property {string} verb the HTTP method, for example `GET` or `POST`
 * @property {string} path the full path of the API endpoint
 * @property {Object} params the parameters to pass in the query or body
 * @property {string} queryPath the path and query string used for the API call
 * @property {string} bearerToken the authentication token
 * @property {string} clientVersion the version of the Amadeus library
 * @property {string} languageVersion the version of Node used
 * @property {string} appId the custom ID of the application using this library
 * @property {string} appVersion the custom version of the application
 *  using this library
 * @property {Object} headers the request headers
 *
 * @param {Object} options
 */
var Request = /*#__PURE__*/function () {
  function Request(options) {
    _classCallCheck(this, Request);
    this.host = options.host;
    this.port = options.port;
    this.ssl = options.ssl;
    this.scheme = this.ssl ? 'https' : 'http';
    this.verb = options.verb;
    this.path = options.path;
    this.params = options.params;
    this.queryPath = this.fullQueryPath();
    this.bearerToken = options.bearerToken;
    this.clientVersion = options.clientVersion;
    this.languageVersion = options.languageVersion;
    this.appId = options.appId;
    this.appVersion = options.appVersion;
    this.customHeaders = options.customHeaders || {};
    this.headers = Object.assign({
      'User-Agent': this.userAgent(),
      'Accept': 'application/json, application/vnd.amadeus+json'
    }, this.customHeaders);
    this.ListHTTPOverride = ['/v2/shopping/flight-offers', '/v1/shopping/seatmaps', '/v1/shopping/availability/flight-availabilities', '/v2/shopping/flight-offers/prediction', '/v1/shopping/flight-offers/pricing', '/v1/shopping/flight-offers/upselling'];
    this.addAuthorizationHeader();
    this.addContentTypeHeader();
    this.addHTTPOverrideHeader();
  }

  // PROTECTED

  /**
   * Compiles the options for the HTTP request.
   *
   * Used by Client.execute when executing this request against the server.
   *
   * @return {Object} an associative array of options to be passed into the
   *  Client.execute function
   * @protected
   */
  return _createClass(Request, [{
    key: "options",
    value: function options() {
      var options = {
        'host': this.host,
        'port': this.port,
        'protocol': "".concat(this.scheme, ":"),
        'path': this.queryPath,
        'method': this.verb,
        'headers': this.headers
      };
      return options;
    }

    /**
     * Creats the body for the API cal, serializing the params if the verb is POST.
     *
     * @return {string} the serialized params
     * @protected
     */
  }, {
    key: "body",
    value: function body() {
      if (this.verb !== 'POST') {
        return '';
      } else {
        if (!this.bearerToken) {
          return _qs["default"].stringify(this.params);
        }
        return this.params;
      }
    }

    // PRIVATE

    /**
     * Build up the custom User Agent
     *
     * @return {string} a user agent in the format "library/version language/version app/version"
     * @private
     */
  }, {
    key: "userAgent",
    value: function userAgent() {
      var userAgent = "amadeus-node/".concat(this.clientVersion, " node/").concat(this.languageVersion);
      if (!this.appId) {
        return userAgent;
      }
      return "".concat(userAgent, " ").concat(this.appId, "/").concat(this.appVersion);
    }

    /**
     * Build the full query path, combining the path with the query params if the
     * verb is 'GET'. For example: '/foo/bar?baz=qux'
     *
     * @return {string} the path and params combined into one string.
     * @private
     */
  }, {
    key: "fullQueryPath",
    value: function fullQueryPath() {
      if (this.verb === 'POST') {
        return this.path;
      } else {
        return "".concat(this.path, "?").concat(_qs["default"].stringify(this.params, {
          arrayFormat: 'comma'
        }));
      }
    }

    /**
     * Adds an Authorization header if the BearerToken is present
     *
     * @private
     */
  }, {
    key: "addAuthorizationHeader",
    value: function addAuthorizationHeader() {
      if (!this.bearerToken) {
        return;
      }
      this.headers['Authorization'] = "Bearer ".concat(this.bearerToken);
    }

    /**
     * Adds an Content-Type header if the HTTP method equals POST
     *
     * @private
     */
  }, {
    key: "addContentTypeHeader",
    value: function addContentTypeHeader() {
      if (this.verb === 'POST' && !this.bearerToken) {
        this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      } else {
        this.headers['Content-Type'] = 'application/vnd.amadeus+json';
      }
      return;
    }

    /**
    * Adds HTTPOverride method if it is required
    *
    *  @private
    */
  }, {
    key: "addHTTPOverrideHeader",
    value: function addHTTPOverrideHeader() {
      if (this.verb === 'POST' && this.ListHTTPOverride.includes(this.path)) {
        this.headers['X-HTTP-Method-Override'] = 'GET';
      }
      return;
    }
  }]);
}();
var _default = exports["default"] = Request;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcXMiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsImUiLCJfX2VzTW9kdWxlIiwiX3R5cGVvZiIsIm8iLCJTeW1ib2wiLCJpdGVyYXRvciIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiX2NsYXNzQ2FsbENoZWNrIiwiYSIsIm4iLCJUeXBlRXJyb3IiLCJfZGVmaW5lUHJvcGVydGllcyIsInIiLCJ0IiwibGVuZ3RoIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJfdG9Qcm9wZXJ0eUtleSIsImtleSIsIl9jcmVhdGVDbGFzcyIsImkiLCJfdG9QcmltaXRpdmUiLCJ0b1ByaW1pdGl2ZSIsImNhbGwiLCJTdHJpbmciLCJOdW1iZXIiLCJSZXF1ZXN0Iiwib3B0aW9ucyIsImhvc3QiLCJwb3J0Iiwic3NsIiwic2NoZW1lIiwidmVyYiIsInBhdGgiLCJwYXJhbXMiLCJxdWVyeVBhdGgiLCJmdWxsUXVlcnlQYXRoIiwiYmVhcmVyVG9rZW4iLCJjbGllbnRWZXJzaW9uIiwibGFuZ3VhZ2VWZXJzaW9uIiwiYXBwSWQiLCJhcHBWZXJzaW9uIiwiY3VzdG9tSGVhZGVycyIsImhlYWRlcnMiLCJhc3NpZ24iLCJ1c2VyQWdlbnQiLCJMaXN0SFRUUE92ZXJyaWRlIiwiYWRkQXV0aG9yaXphdGlvbkhlYWRlciIsImFkZENvbnRlbnRUeXBlSGVhZGVyIiwiYWRkSFRUUE92ZXJyaWRlSGVhZGVyIiwidmFsdWUiLCJjb25jYXQiLCJib2R5IiwicXMiLCJzdHJpbmdpZnkiLCJhcnJheUZvcm1hdCIsImluY2x1ZGVzIiwiX2RlZmF1bHQiLCJleHBvcnRzIiwibW9kdWxlIiwiZGVmYXVsdCJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hbWFkZXVzL2NsaWVudC9yZXF1ZXN0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBxcyBmcm9tICdxcyc7XG5cbi8qKlxuICogQSBSZXF1ZXN0IG9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgY29tcGlsZWQgaW5mb3JtYXRpb24gYWJvdXQgdGhpcyByZXF1ZXN0LlxuICpcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBob3N0IHRoZSBob3N0IHVzZWQgZm9yIHRoaXMgQVBJIGNhbGxcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBwb3J0IHRoZSBwb3J0IGZvciB0aGlzIEFQSSBjYWxsLiBTdGFuZGFyZCBzZXQgdG8gNDQzLlxuICogQHByb3BlcnR5IHtib29sZWFufSBzc2wgd2V0aGVyIHRoaXMgQVBJIGNhbGwgdXNlcyBTU0xcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzY2hlbWUgdGhlIHNjaGVtZSBpbmZlcnJlZCBmcm9tIHRoZSBTU0wgc3RhdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2ZXJiIHRoZSBIVFRQIG1ldGhvZCwgZm9yIGV4YW1wbGUgYEdFVGAgb3IgYFBPU1RgXG4gKiBAcHJvcGVydHkge3N0cmluZ30gcGF0aCB0aGUgZnVsbCBwYXRoIG9mIHRoZSBBUEkgZW5kcG9pbnRcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBwYXJhbXMgdGhlIHBhcmFtZXRlcnMgdG8gcGFzcyBpbiB0aGUgcXVlcnkgb3IgYm9keVxuICogQHByb3BlcnR5IHtzdHJpbmd9IHF1ZXJ5UGF0aCB0aGUgcGF0aCBhbmQgcXVlcnkgc3RyaW5nIHVzZWQgZm9yIHRoZSBBUEkgY2FsbFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGJlYXJlclRva2VuIHRoZSBhdXRoZW50aWNhdGlvbiB0b2tlblxuICogQHByb3BlcnR5IHtzdHJpbmd9IGNsaWVudFZlcnNpb24gdGhlIHZlcnNpb24gb2YgdGhlIEFtYWRldXMgbGlicmFyeVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGxhbmd1YWdlVmVyc2lvbiB0aGUgdmVyc2lvbiBvZiBOb2RlIHVzZWRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBhcHBJZCB0aGUgY3VzdG9tIElEIG9mIHRoZSBhcHBsaWNhdGlvbiB1c2luZyB0aGlzIGxpYnJhcnlcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBhcHBWZXJzaW9uIHRoZSBjdXN0b20gdmVyc2lvbiBvZiB0aGUgYXBwbGljYXRpb25cbiAqICB1c2luZyB0aGlzIGxpYnJhcnlcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBoZWFkZXJzIHRoZSByZXF1ZXN0IGhlYWRlcnNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICovXG5jbGFzcyBSZXF1ZXN0IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHRoaXMuaG9zdCAgICAgICAgICAgID0gb3B0aW9ucy5ob3N0O1xuICAgIHRoaXMucG9ydCAgICAgICAgICAgID0gb3B0aW9ucy5wb3J0O1xuICAgIHRoaXMuc3NsICAgICAgICAgICAgID0gb3B0aW9ucy5zc2w7XG4gICAgdGhpcy5zY2hlbWUgICAgICAgICAgPSB0aGlzLnNzbCA/ICdodHRwcycgOiAnaHR0cCc7XG4gICAgdGhpcy52ZXJiICAgICAgICAgICAgPSBvcHRpb25zLnZlcmI7XG4gICAgdGhpcy5wYXRoICAgICAgICAgICAgPSBvcHRpb25zLnBhdGg7XG4gICAgdGhpcy5wYXJhbXMgICAgICAgICAgPSBvcHRpb25zLnBhcmFtcztcbiAgICB0aGlzLnF1ZXJ5UGF0aCAgICAgICA9IHRoaXMuZnVsbFF1ZXJ5UGF0aCgpO1xuICAgIHRoaXMuYmVhcmVyVG9rZW4gICAgID0gb3B0aW9ucy5iZWFyZXJUb2tlbjtcbiAgICB0aGlzLmNsaWVudFZlcnNpb24gICA9IG9wdGlvbnMuY2xpZW50VmVyc2lvbjtcbiAgICB0aGlzLmxhbmd1YWdlVmVyc2lvbiA9IG9wdGlvbnMubGFuZ3VhZ2VWZXJzaW9uO1xuICAgIHRoaXMuYXBwSWQgICAgICAgICAgID0gb3B0aW9ucy5hcHBJZDtcbiAgICB0aGlzLmFwcFZlcnNpb24gICAgICA9IG9wdGlvbnMuYXBwVmVyc2lvbjtcbiAgICB0aGlzLmN1c3RvbUhlYWRlcnMgICA9IG9wdGlvbnMuY3VzdG9tSGVhZGVycyB8fCB7fTtcbiAgICB0aGlzLmhlYWRlcnMgICAgICAgICA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgJ1VzZXItQWdlbnQnIDogdGhpcy51c2VyQWdlbnQoKSxcbiAgICAgICdBY2NlcHQnIDogJ2FwcGxpY2F0aW9uL2pzb24sIGFwcGxpY2F0aW9uL3ZuZC5hbWFkZXVzK2pzb24nXG4gICAgfSwgdGhpcy5jdXN0b21IZWFkZXJzKTtcbiAgICB0aGlzLkxpc3RIVFRQT3ZlcnJpZGU9IFtcbiAgICAgICcvdjIvc2hvcHBpbmcvZmxpZ2h0LW9mZmVycycsXG4gICAgICAnL3YxL3Nob3BwaW5nL3NlYXRtYXBzJyxcbiAgICAgICcvdjEvc2hvcHBpbmcvYXZhaWxhYmlsaXR5L2ZsaWdodC1hdmFpbGFiaWxpdGllcycsXG4gICAgICAnL3YyL3Nob3BwaW5nL2ZsaWdodC1vZmZlcnMvcHJlZGljdGlvbicsXG4gICAgICAnL3YxL3Nob3BwaW5nL2ZsaWdodC1vZmZlcnMvcHJpY2luZycsXG4gICAgICAnL3YxL3Nob3BwaW5nL2ZsaWdodC1vZmZlcnMvdXBzZWxsaW5nJ1xuICAgIF07XG4gICAgdGhpcy5hZGRBdXRob3JpemF0aW9uSGVhZGVyKCk7XG4gICAgdGhpcy5hZGRDb250ZW50VHlwZUhlYWRlcigpO1xuICAgIHRoaXMuYWRkSFRUUE92ZXJyaWRlSGVhZGVyKCk7XG4gIH1cblxuICAvLyBQUk9URUNURURcblxuICAvKipcbiAgICogQ29tcGlsZXMgdGhlIG9wdGlvbnMgZm9yIHRoZSBIVFRQIHJlcXVlc3QuXG4gICAqXG4gICAqIFVzZWQgYnkgQ2xpZW50LmV4ZWN1dGUgd2hlbiBleGVjdXRpbmcgdGhpcyByZXF1ZXN0IGFnYWluc3QgdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSBhbiBhc3NvY2lhdGl2ZSBhcnJheSBvZiBvcHRpb25zIHRvIGJlIHBhc3NlZCBpbnRvIHRoZVxuICAgKiAgQ2xpZW50LmV4ZWN1dGUgZnVuY3Rpb25cbiAgICogQHByb3RlY3RlZFxuICAgKi9cbiAgb3B0aW9ucygpIHtcbiAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICdob3N0JyA6IHRoaXMuaG9zdCxcbiAgICAgICdwb3J0JyA6IHRoaXMucG9ydCxcbiAgICAgICdwcm90b2NvbCcgOiBgJHt0aGlzLnNjaGVtZX06YCxcbiAgICAgICdwYXRoJyA6IHRoaXMucXVlcnlQYXRoLFxuICAgICAgJ21ldGhvZCcgOiB0aGlzLnZlcmIsXG4gICAgICAnaGVhZGVycycgOiB0aGlzLmhlYWRlcnNcbiAgICB9O1xuICAgIHJldHVybiBvcHRpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0cyB0aGUgYm9keSBmb3IgdGhlIEFQSSBjYWwsIHNlcmlhbGl6aW5nIHRoZSBwYXJhbXMgaWYgdGhlIHZlcmIgaXMgUE9TVC5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgc2VyaWFsaXplZCBwYXJhbXNcbiAgICogQHByb3RlY3RlZFxuICAgKi9cbiAgYm9keSgpIHtcbiAgICBpZiAodGhpcy52ZXJiICE9PSAnUE9TVCcpIHsgcmV0dXJuICcnOyB9XG4gICAgZWxzZSB7XG4gICAgICBpZiAoIXRoaXMuYmVhcmVyVG9rZW4pIHtcbiAgICAgICAgcmV0dXJuIHFzLnN0cmluZ2lmeSh0aGlzLnBhcmFtcyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5wYXJhbXM7XG4gICAgfVxuICB9XG5cbiAgLy8gUFJJVkFURVxuXG4gIC8qKlxuICAgKiBCdWlsZCB1cCB0aGUgY3VzdG9tIFVzZXIgQWdlbnRcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBhIHVzZXIgYWdlbnQgaW4gdGhlIGZvcm1hdCBcImxpYnJhcnkvdmVyc2lvbiBsYW5ndWFnZS92ZXJzaW9uIGFwcC92ZXJzaW9uXCJcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHVzZXJBZ2VudCgpIHtcbiAgICBsZXQgdXNlckFnZW50ID0gYGFtYWRldXMtbm9kZS8ke3RoaXMuY2xpZW50VmVyc2lvbn0gbm9kZS8ke3RoaXMubGFuZ3VhZ2VWZXJzaW9ufWA7XG4gICAgaWYgKCF0aGlzLmFwcElkKSB7IHJldHVybiB1c2VyQWdlbnQ7IH1cbiAgICByZXR1cm4gYCR7dXNlckFnZW50fSAke3RoaXMuYXBwSWR9LyR7dGhpcy5hcHBWZXJzaW9ufWA7XG4gIH1cblxuICAvKipcbiAgICogQnVpbGQgdGhlIGZ1bGwgcXVlcnkgcGF0aCwgY29tYmluaW5nIHRoZSBwYXRoIHdpdGggdGhlIHF1ZXJ5IHBhcmFtcyBpZiB0aGVcbiAgICogdmVyYiBpcyAnR0VUJy4gRm9yIGV4YW1wbGU6ICcvZm9vL2Jhcj9iYXo9cXV4J1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBwYXRoIGFuZCBwYXJhbXMgY29tYmluZWQgaW50byBvbmUgc3RyaW5nLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVsbFF1ZXJ5UGF0aCgpIHtcbiAgICBpZiAodGhpcy52ZXJiID09PSAnUE9TVCcpIHsgcmV0dXJuIHRoaXMucGF0aDsgfVxuICAgIGVsc2UgeyByZXR1cm4gYCR7dGhpcy5wYXRofT8ke3FzLnN0cmluZ2lmeSh0aGlzLnBhcmFtcywgeyBhcnJheUZvcm1hdDogJ2NvbW1hJyB9KX1gOyB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBBdXRob3JpemF0aW9uIGhlYWRlciBpZiB0aGUgQmVhcmVyVG9rZW4gaXMgcHJlc2VudFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYWRkQXV0aG9yaXphdGlvbkhlYWRlcigpIHtcbiAgICBpZiAoIXRoaXMuYmVhcmVyVG9rZW4pIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5oZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPSBgQmVhcmVyICR7dGhpcy5iZWFyZXJUb2tlbn1gO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gQ29udGVudC1UeXBlIGhlYWRlciBpZiB0aGUgSFRUUCBtZXRob2QgZXF1YWxzIFBPU1RcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGFkZENvbnRlbnRUeXBlSGVhZGVyKCkge1xuICAgIGlmICh0aGlzLnZlcmIgPT09ICdQT1NUJyAmJiAhdGhpcy5iZWFyZXJUb2tlbikge1xuICAgICAgdGhpcy5oZWFkZXJzWydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL3ZuZC5hbWFkZXVzK2pzb24nO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgKiBBZGRzIEhUVFBPdmVycmlkZSBtZXRob2QgaWYgaXQgaXMgcmVxdWlyZWRcbiAgKlxuICAqICBAcHJpdmF0ZVxuICAqL1xuICBhZGRIVFRQT3ZlcnJpZGVIZWFkZXIoKSB7XG4gICAgaWYgKHRoaXMudmVyYiA9PT0gJ1BPU1QnICYmIHRoaXMuTGlzdEhUVFBPdmVycmlkZS5pbmNsdWRlcyh0aGlzLnBhdGgpKSB7XG4gICAgICB0aGlzLmhlYWRlcnNbJ1gtSFRUUC1NZXRob2QtT3ZlcnJpZGUnXSA9ICdHRVQnO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVxdWVzdDtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsR0FBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQW9CLFNBQUFELHVCQUFBRSxDQUFBLFdBQUFBLENBQUEsSUFBQUEsQ0FBQSxDQUFBQyxVQUFBLEdBQUFELENBQUEsZ0JBQUFBLENBQUE7QUFBQSxTQUFBRSxRQUFBQyxDQUFBLHNDQUFBRCxPQUFBLHdCQUFBRSxNQUFBLHVCQUFBQSxNQUFBLENBQUFDLFFBQUEsYUFBQUYsQ0FBQSxrQkFBQUEsQ0FBQSxnQkFBQUEsQ0FBQSxXQUFBQSxDQUFBLHlCQUFBQyxNQUFBLElBQUFELENBQUEsQ0FBQUcsV0FBQSxLQUFBRixNQUFBLElBQUFELENBQUEsS0FBQUMsTUFBQSxDQUFBRyxTQUFBLHFCQUFBSixDQUFBLEtBQUFELE9BQUEsQ0FBQUMsQ0FBQTtBQUFBLFNBQUFLLGdCQUFBQyxDQUFBLEVBQUFDLENBQUEsVUFBQUQsQ0FBQSxZQUFBQyxDQUFBLGFBQUFDLFNBQUE7QUFBQSxTQUFBQyxrQkFBQVosQ0FBQSxFQUFBYSxDQUFBLGFBQUFDLENBQUEsTUFBQUEsQ0FBQSxHQUFBRCxDQUFBLENBQUFFLE1BQUEsRUFBQUQsQ0FBQSxVQUFBWCxDQUFBLEdBQUFVLENBQUEsQ0FBQUMsQ0FBQSxHQUFBWCxDQUFBLENBQUFhLFVBQUEsR0FBQWIsQ0FBQSxDQUFBYSxVQUFBLFFBQUFiLENBQUEsQ0FBQWMsWUFBQSxrQkFBQWQsQ0FBQSxLQUFBQSxDQUFBLENBQUFlLFFBQUEsUUFBQUMsTUFBQSxDQUFBQyxjQUFBLENBQUFwQixDQUFBLEVBQUFxQixjQUFBLENBQUFsQixDQUFBLENBQUFtQixHQUFBLEdBQUFuQixDQUFBO0FBQUEsU0FBQW9CLGFBQUF2QixDQUFBLEVBQUFhLENBQUEsRUFBQUMsQ0FBQSxXQUFBRCxDQUFBLElBQUFELGlCQUFBLENBQUFaLENBQUEsQ0FBQU8sU0FBQSxFQUFBTSxDQUFBLEdBQUFDLENBQUEsSUFBQUYsaUJBQUEsQ0FBQVosQ0FBQSxFQUFBYyxDQUFBLEdBQUFLLE1BQUEsQ0FBQUMsY0FBQSxDQUFBcEIsQ0FBQSxpQkFBQWtCLFFBQUEsU0FBQWxCLENBQUE7QUFBQSxTQUFBcUIsZUFBQVAsQ0FBQSxRQUFBVSxDQUFBLEdBQUFDLFlBQUEsQ0FBQVgsQ0FBQSxnQ0FBQVosT0FBQSxDQUFBc0IsQ0FBQSxJQUFBQSxDQUFBLEdBQUFBLENBQUE7QUFBQSxTQUFBQyxhQUFBWCxDQUFBLEVBQUFELENBQUEsb0JBQUFYLE9BQUEsQ0FBQVksQ0FBQSxNQUFBQSxDQUFBLFNBQUFBLENBQUEsTUFBQWQsQ0FBQSxHQUFBYyxDQUFBLENBQUFWLE1BQUEsQ0FBQXNCLFdBQUEsa0JBQUExQixDQUFBLFFBQUF3QixDQUFBLEdBQUF4QixDQUFBLENBQUEyQixJQUFBLENBQUFiLENBQUEsRUFBQUQsQ0FBQSxnQ0FBQVgsT0FBQSxDQUFBc0IsQ0FBQSxVQUFBQSxDQUFBLFlBQUFiLFNBQUEseUVBQUFFLENBQUEsR0FBQWUsTUFBQSxHQUFBQyxNQUFBLEVBQUFmLENBQUE7QUFFcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBcEJBLElBcUJNZ0IsT0FBTztFQUNYLFNBQUFBLFFBQVlDLE9BQU8sRUFBRTtJQUFBdkIsZUFBQSxPQUFBc0IsT0FBQTtJQUNuQixJQUFJLENBQUNFLElBQUksR0FBY0QsT0FBTyxDQUFDQyxJQUFJO0lBQ25DLElBQUksQ0FBQ0MsSUFBSSxHQUFjRixPQUFPLENBQUNFLElBQUk7SUFDbkMsSUFBSSxDQUFDQyxHQUFHLEdBQWVILE9BQU8sQ0FBQ0csR0FBRztJQUNsQyxJQUFJLENBQUNDLE1BQU0sR0FBWSxJQUFJLENBQUNELEdBQUcsR0FBRyxPQUFPLEdBQUcsTUFBTTtJQUNsRCxJQUFJLENBQUNFLElBQUksR0FBY0wsT0FBTyxDQUFDSyxJQUFJO0lBQ25DLElBQUksQ0FBQ0MsSUFBSSxHQUFjTixPQUFPLENBQUNNLElBQUk7SUFDbkMsSUFBSSxDQUFDQyxNQUFNLEdBQVlQLE9BQU8sQ0FBQ08sTUFBTTtJQUNyQyxJQUFJLENBQUNDLFNBQVMsR0FBUyxJQUFJLENBQUNDLGFBQWEsQ0FBQyxDQUFDO0lBQzNDLElBQUksQ0FBQ0MsV0FBVyxHQUFPVixPQUFPLENBQUNVLFdBQVc7SUFDMUMsSUFBSSxDQUFDQyxhQUFhLEdBQUtYLE9BQU8sQ0FBQ1csYUFBYTtJQUM1QyxJQUFJLENBQUNDLGVBQWUsR0FBR1osT0FBTyxDQUFDWSxlQUFlO0lBQzlDLElBQUksQ0FBQ0MsS0FBSyxHQUFhYixPQUFPLENBQUNhLEtBQUs7SUFDcEMsSUFBSSxDQUFDQyxVQUFVLEdBQVFkLE9BQU8sQ0FBQ2MsVUFBVTtJQUN6QyxJQUFJLENBQUNDLGFBQWEsR0FBS2YsT0FBTyxDQUFDZSxhQUFhLElBQUksQ0FBQyxDQUFDO0lBQ2xELElBQUksQ0FBQ0MsT0FBTyxHQUFXNUIsTUFBTSxDQUFDNkIsTUFBTSxDQUFDO01BQ25DLFlBQVksRUFBRyxJQUFJLENBQUNDLFNBQVMsQ0FBQyxDQUFDO01BQy9CLFFBQVEsRUFBRztJQUNiLENBQUMsRUFBRSxJQUFJLENBQUNILGFBQWEsQ0FBQztJQUN0QixJQUFJLENBQUNJLGdCQUFnQixHQUFFLENBQ3JCLDRCQUE0QixFQUM1Qix1QkFBdUIsRUFDdkIsaURBQWlELEVBQ2pELHVDQUF1QyxFQUN2QyxvQ0FBb0MsRUFDcEMsc0NBQXNDLENBQ3ZDO0lBQ0QsSUFBSSxDQUFDQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQzdCLElBQUksQ0FBQ0Msb0JBQW9CLENBQUMsQ0FBQztJQUMzQixJQUFJLENBQUNDLHFCQUFxQixDQUFDLENBQUM7RUFDOUI7O0VBRUE7O0VBRUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBUkUsT0FBQTlCLFlBQUEsQ0FBQU8sT0FBQTtJQUFBUixHQUFBO0lBQUFnQyxLQUFBLEVBU0EsU0FBQXZCLE9BQU9BLENBQUEsRUFBRztNQUNSLElBQUlBLE9BQU8sR0FBRztRQUNaLE1BQU0sRUFBRyxJQUFJLENBQUNDLElBQUk7UUFDbEIsTUFBTSxFQUFHLElBQUksQ0FBQ0MsSUFBSTtRQUNsQixVQUFVLEtBQUFzQixNQUFBLENBQU0sSUFBSSxDQUFDcEIsTUFBTSxNQUFHO1FBQzlCLE1BQU0sRUFBRyxJQUFJLENBQUNJLFNBQVM7UUFDdkIsUUFBUSxFQUFHLElBQUksQ0FBQ0gsSUFBSTtRQUNwQixTQUFTLEVBQUcsSUFBSSxDQUFDVztNQUNuQixDQUFDO01BQ0QsT0FBT2hCLE9BQU87SUFDaEI7O0lBRUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBTEU7SUFBQVQsR0FBQTtJQUFBZ0MsS0FBQSxFQU1BLFNBQUFFLElBQUlBLENBQUEsRUFBRztNQUNMLElBQUksSUFBSSxDQUFDcEIsSUFBSSxLQUFLLE1BQU0sRUFBRTtRQUFFLE9BQU8sRUFBRTtNQUFFLENBQUMsTUFDbkM7UUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDSyxXQUFXLEVBQUU7VUFDckIsT0FBT2dCLGNBQUUsQ0FBQ0MsU0FBUyxDQUFDLElBQUksQ0FBQ3BCLE1BQU0sQ0FBQztRQUNsQztRQUNBLE9BQU8sSUFBSSxDQUFDQSxNQUFNO01BQ3BCO0lBQ0Y7O0lBRUE7O0lBRUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBTEU7SUFBQWhCLEdBQUE7SUFBQWdDLEtBQUEsRUFNQSxTQUFBTCxTQUFTQSxDQUFBLEVBQUc7TUFDVixJQUFJQSxTQUFTLG1CQUFBTSxNQUFBLENBQW1CLElBQUksQ0FBQ2IsYUFBYSxZQUFBYSxNQUFBLENBQVMsSUFBSSxDQUFDWixlQUFlLENBQUU7TUFDakYsSUFBSSxDQUFDLElBQUksQ0FBQ0MsS0FBSyxFQUFFO1FBQUUsT0FBT0ssU0FBUztNQUFFO01BQ3JDLFVBQUFNLE1BQUEsQ0FBVU4sU0FBUyxPQUFBTSxNQUFBLENBQUksSUFBSSxDQUFDWCxLQUFLLE9BQUFXLE1BQUEsQ0FBSSxJQUFJLENBQUNWLFVBQVU7SUFDdEQ7O0lBRUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFORTtJQUFBdkIsR0FBQTtJQUFBZ0MsS0FBQSxFQU9BLFNBQUFkLGFBQWFBLENBQUEsRUFBRztNQUNkLElBQUksSUFBSSxDQUFDSixJQUFJLEtBQUssTUFBTSxFQUFFO1FBQUUsT0FBTyxJQUFJLENBQUNDLElBQUk7TUFBRSxDQUFDLE1BQzFDO1FBQUUsVUFBQWtCLE1BQUEsQ0FBVSxJQUFJLENBQUNsQixJQUFJLE9BQUFrQixNQUFBLENBQUlFLGNBQUUsQ0FBQ0MsU0FBUyxDQUFDLElBQUksQ0FBQ3BCLE1BQU0sRUFBRTtVQUFFcUIsV0FBVyxFQUFFO1FBQVEsQ0FBQyxDQUFDO01BQUk7SUFDdkY7O0lBRUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTtFQUpFO0lBQUFyQyxHQUFBO0lBQUFnQyxLQUFBLEVBS0EsU0FBQUgsc0JBQXNCQSxDQUFBLEVBQUc7TUFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQ1YsV0FBVyxFQUFFO1FBQUU7TUFBUTtNQUNqQyxJQUFJLENBQUNNLE9BQU8sQ0FBQyxlQUFlLENBQUMsYUFBQVEsTUFBQSxDQUFhLElBQUksQ0FBQ2QsV0FBVyxDQUFFO0lBQzlEOztJQUVBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7RUFKRTtJQUFBbkIsR0FBQTtJQUFBZ0MsS0FBQSxFQUtBLFNBQUFGLG9CQUFvQkEsQ0FBQSxFQUFHO01BQ3JCLElBQUksSUFBSSxDQUFDaEIsSUFBSSxLQUFLLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQ0ssV0FBVyxFQUFFO1FBQzdDLElBQUksQ0FBQ00sT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLG1DQUFtQztNQUNwRSxDQUFDLE1BQU07UUFDTCxJQUFJLENBQUNBLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyw4QkFBOEI7TUFDL0Q7TUFDQTtJQUNGOztJQUVBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7RUFKRTtJQUFBekIsR0FBQTtJQUFBZ0MsS0FBQSxFQUtBLFNBQUFELHFCQUFxQkEsQ0FBQSxFQUFHO01BQ3RCLElBQUksSUFBSSxDQUFDakIsSUFBSSxLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUNjLGdCQUFnQixDQUFDVSxRQUFRLENBQUMsSUFBSSxDQUFDdkIsSUFBSSxDQUFDLEVBQUU7UUFDckUsSUFBSSxDQUFDVSxPQUFPLENBQUMsd0JBQXdCLENBQUMsR0FBRyxLQUFLO01BQ2hEO01BQ0E7SUFDRjtFQUFDO0FBQUE7QUFBQSxJQUFBYyxRQUFBLEdBQUFDLE9BQUEsY0FHWWhDLE9BQU87QUFBQWlDLE1BQUEsQ0FBQUQsT0FBQSxHQUFBQSxPQUFBLENBQUFFLE9BQUEiLCJpZ25vcmVMaXN0IjpbXX0=