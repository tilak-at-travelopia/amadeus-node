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
    // this.addHTTPOverrideHeader();
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
      if (this.verb !== 'POST' && this.verb !== 'PATCH') {
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
      if (this.verb === 'POST' || this.verb === 'PATCH') {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcXMiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsImUiLCJfX2VzTW9kdWxlIiwiX3R5cGVvZiIsIm8iLCJTeW1ib2wiLCJpdGVyYXRvciIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiX2NsYXNzQ2FsbENoZWNrIiwiYSIsIm4iLCJUeXBlRXJyb3IiLCJfZGVmaW5lUHJvcGVydGllcyIsInIiLCJ0IiwibGVuZ3RoIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJfdG9Qcm9wZXJ0eUtleSIsImtleSIsIl9jcmVhdGVDbGFzcyIsImkiLCJfdG9QcmltaXRpdmUiLCJ0b1ByaW1pdGl2ZSIsImNhbGwiLCJTdHJpbmciLCJOdW1iZXIiLCJSZXF1ZXN0Iiwib3B0aW9ucyIsImhvc3QiLCJwb3J0Iiwic3NsIiwic2NoZW1lIiwidmVyYiIsInBhdGgiLCJwYXJhbXMiLCJxdWVyeVBhdGgiLCJmdWxsUXVlcnlQYXRoIiwiYmVhcmVyVG9rZW4iLCJjbGllbnRWZXJzaW9uIiwibGFuZ3VhZ2VWZXJzaW9uIiwiYXBwSWQiLCJhcHBWZXJzaW9uIiwiY3VzdG9tSGVhZGVycyIsImhlYWRlcnMiLCJhc3NpZ24iLCJ1c2VyQWdlbnQiLCJMaXN0SFRUUE92ZXJyaWRlIiwiYWRkQXV0aG9yaXphdGlvbkhlYWRlciIsImFkZENvbnRlbnRUeXBlSGVhZGVyIiwidmFsdWUiLCJjb25jYXQiLCJib2R5IiwicXMiLCJzdHJpbmdpZnkiLCJhcnJheUZvcm1hdCIsImFkZEhUVFBPdmVycmlkZUhlYWRlciIsImluY2x1ZGVzIiwiX2RlZmF1bHQiLCJleHBvcnRzIiwibW9kdWxlIiwiZGVmYXVsdCJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hbWFkZXVzL2NsaWVudC9yZXF1ZXN0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBxcyBmcm9tICdxcyc7XG5cbi8qKlxuICogQSBSZXF1ZXN0IG9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgY29tcGlsZWQgaW5mb3JtYXRpb24gYWJvdXQgdGhpcyByZXF1ZXN0LlxuICpcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBob3N0IHRoZSBob3N0IHVzZWQgZm9yIHRoaXMgQVBJIGNhbGxcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBwb3J0IHRoZSBwb3J0IGZvciB0aGlzIEFQSSBjYWxsLiBTdGFuZGFyZCBzZXQgdG8gNDQzLlxuICogQHByb3BlcnR5IHtib29sZWFufSBzc2wgd2V0aGVyIHRoaXMgQVBJIGNhbGwgdXNlcyBTU0xcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzY2hlbWUgdGhlIHNjaGVtZSBpbmZlcnJlZCBmcm9tIHRoZSBTU0wgc3RhdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2ZXJiIHRoZSBIVFRQIG1ldGhvZCwgZm9yIGV4YW1wbGUgYEdFVGAgb3IgYFBPU1RgXG4gKiBAcHJvcGVydHkge3N0cmluZ30gcGF0aCB0aGUgZnVsbCBwYXRoIG9mIHRoZSBBUEkgZW5kcG9pbnRcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBwYXJhbXMgdGhlIHBhcmFtZXRlcnMgdG8gcGFzcyBpbiB0aGUgcXVlcnkgb3IgYm9keVxuICogQHByb3BlcnR5IHtzdHJpbmd9IHF1ZXJ5UGF0aCB0aGUgcGF0aCBhbmQgcXVlcnkgc3RyaW5nIHVzZWQgZm9yIHRoZSBBUEkgY2FsbFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGJlYXJlclRva2VuIHRoZSBhdXRoZW50aWNhdGlvbiB0b2tlblxuICogQHByb3BlcnR5IHtzdHJpbmd9IGNsaWVudFZlcnNpb24gdGhlIHZlcnNpb24gb2YgdGhlIEFtYWRldXMgbGlicmFyeVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGxhbmd1YWdlVmVyc2lvbiB0aGUgdmVyc2lvbiBvZiBOb2RlIHVzZWRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBhcHBJZCB0aGUgY3VzdG9tIElEIG9mIHRoZSBhcHBsaWNhdGlvbiB1c2luZyB0aGlzIGxpYnJhcnlcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBhcHBWZXJzaW9uIHRoZSBjdXN0b20gdmVyc2lvbiBvZiB0aGUgYXBwbGljYXRpb25cbiAqICB1c2luZyB0aGlzIGxpYnJhcnlcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBoZWFkZXJzIHRoZSByZXF1ZXN0IGhlYWRlcnNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICovXG5jbGFzcyBSZXF1ZXN0IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHRoaXMuaG9zdCAgICAgICAgICAgID0gb3B0aW9ucy5ob3N0O1xuICAgIHRoaXMucG9ydCAgICAgICAgICAgID0gb3B0aW9ucy5wb3J0O1xuICAgIHRoaXMuc3NsICAgICAgICAgICAgID0gb3B0aW9ucy5zc2w7XG4gICAgdGhpcy5zY2hlbWUgICAgICAgICAgPSB0aGlzLnNzbCA/ICdodHRwcycgOiAnaHR0cCc7XG4gICAgdGhpcy52ZXJiICAgICAgICAgICAgPSBvcHRpb25zLnZlcmI7XG4gICAgdGhpcy5wYXRoICAgICAgICAgICAgPSBvcHRpb25zLnBhdGg7XG4gICAgdGhpcy5wYXJhbXMgICAgICAgICAgPSBvcHRpb25zLnBhcmFtcztcbiAgICB0aGlzLnF1ZXJ5UGF0aCAgICAgICA9IHRoaXMuZnVsbFF1ZXJ5UGF0aCgpO1xuICAgIHRoaXMuYmVhcmVyVG9rZW4gICAgID0gb3B0aW9ucy5iZWFyZXJUb2tlbjtcbiAgICB0aGlzLmNsaWVudFZlcnNpb24gICA9IG9wdGlvbnMuY2xpZW50VmVyc2lvbjtcbiAgICB0aGlzLmxhbmd1YWdlVmVyc2lvbiA9IG9wdGlvbnMubGFuZ3VhZ2VWZXJzaW9uO1xuICAgIHRoaXMuYXBwSWQgICAgICAgICAgID0gb3B0aW9ucy5hcHBJZDtcbiAgICB0aGlzLmFwcFZlcnNpb24gICAgICA9IG9wdGlvbnMuYXBwVmVyc2lvbjtcbiAgICB0aGlzLmN1c3RvbUhlYWRlcnMgICA9IG9wdGlvbnMuY3VzdG9tSGVhZGVycyB8fCB7fTtcbiAgICB0aGlzLmhlYWRlcnMgICAgICAgICA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgJ1VzZXItQWdlbnQnIDogdGhpcy51c2VyQWdlbnQoKSxcbiAgICAgICdBY2NlcHQnIDogJ2FwcGxpY2F0aW9uL2pzb24sIGFwcGxpY2F0aW9uL3ZuZC5hbWFkZXVzK2pzb24nXG4gICAgfSwgdGhpcy5jdXN0b21IZWFkZXJzKTtcbiAgICB0aGlzLkxpc3RIVFRQT3ZlcnJpZGU9IFtcbiAgICAgICcvdjIvc2hvcHBpbmcvZmxpZ2h0LW9mZmVycycsXG4gICAgICAnL3YxL3Nob3BwaW5nL3NlYXRtYXBzJyxcbiAgICAgICcvdjEvc2hvcHBpbmcvYXZhaWxhYmlsaXR5L2ZsaWdodC1hdmFpbGFiaWxpdGllcycsXG4gICAgICAnL3YyL3Nob3BwaW5nL2ZsaWdodC1vZmZlcnMvcHJlZGljdGlvbicsXG4gICAgICAnL3YxL3Nob3BwaW5nL2ZsaWdodC1vZmZlcnMvcHJpY2luZycsXG4gICAgICAnL3YxL3Nob3BwaW5nL2ZsaWdodC1vZmZlcnMvdXBzZWxsaW5nJ1xuICAgIF07XG4gICAgdGhpcy5hZGRBdXRob3JpemF0aW9uSGVhZGVyKCk7XG4gICAgdGhpcy5hZGRDb250ZW50VHlwZUhlYWRlcigpO1xuICAgIC8vIHRoaXMuYWRkSFRUUE92ZXJyaWRlSGVhZGVyKCk7XG4gIH1cblxuICAvLyBQUk9URUNURURcblxuICAvKipcbiAgICogQ29tcGlsZXMgdGhlIG9wdGlvbnMgZm9yIHRoZSBIVFRQIHJlcXVlc3QuXG4gICAqXG4gICAqIFVzZWQgYnkgQ2xpZW50LmV4ZWN1dGUgd2hlbiBleGVjdXRpbmcgdGhpcyByZXF1ZXN0IGFnYWluc3QgdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSBhbiBhc3NvY2lhdGl2ZSBhcnJheSBvZiBvcHRpb25zIHRvIGJlIHBhc3NlZCBpbnRvIHRoZVxuICAgKiAgQ2xpZW50LmV4ZWN1dGUgZnVuY3Rpb25cbiAgICogQHByb3RlY3RlZFxuICAgKi9cbiAgb3B0aW9ucygpIHtcbiAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICdob3N0JyA6IHRoaXMuaG9zdCxcbiAgICAgICdwb3J0JyA6IHRoaXMucG9ydCxcbiAgICAgICdwcm90b2NvbCcgOiBgJHt0aGlzLnNjaGVtZX06YCxcbiAgICAgICdwYXRoJyA6IHRoaXMucXVlcnlQYXRoLFxuICAgICAgJ21ldGhvZCcgOiB0aGlzLnZlcmIsXG4gICAgICAnaGVhZGVycycgOiB0aGlzLmhlYWRlcnNcbiAgICB9O1xuICAgIHJldHVybiBvcHRpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0cyB0aGUgYm9keSBmb3IgdGhlIEFQSSBjYWwsIHNlcmlhbGl6aW5nIHRoZSBwYXJhbXMgaWYgdGhlIHZlcmIgaXMgUE9TVC5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgc2VyaWFsaXplZCBwYXJhbXNcbiAgICogQHByb3RlY3RlZFxuICAgKi9cbiAgYm9keSgpIHtcbiAgICBpZiAodGhpcy52ZXJiICE9PSAnUE9TVCcgJiYgdGhpcy52ZXJiICE9PSAnUEFUQ0gnKSB7IHJldHVybiAnJzsgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKCF0aGlzLmJlYXJlclRva2VuKSB7XG4gICAgICAgIHJldHVybiBxcy5zdHJpbmdpZnkodGhpcy5wYXJhbXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucGFyYW1zO1xuICAgIH1cbiAgfVxuXG4gIC8vIFBSSVZBVEVcblxuICAvKipcbiAgICogQnVpbGQgdXAgdGhlIGN1c3RvbSBVc2VyIEFnZW50XG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYSB1c2VyIGFnZW50IGluIHRoZSBmb3JtYXQgXCJsaWJyYXJ5L3ZlcnNpb24gbGFuZ3VhZ2UvdmVyc2lvbiBhcHAvdmVyc2lvblwiXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB1c2VyQWdlbnQoKSB7XG4gICAgbGV0IHVzZXJBZ2VudCA9IGBhbWFkZXVzLW5vZGUvJHt0aGlzLmNsaWVudFZlcnNpb259IG5vZGUvJHt0aGlzLmxhbmd1YWdlVmVyc2lvbn1gO1xuICAgIGlmICghdGhpcy5hcHBJZCkgeyByZXR1cm4gdXNlckFnZW50OyB9XG4gICAgcmV0dXJuIGAke3VzZXJBZ2VudH0gJHt0aGlzLmFwcElkfS8ke3RoaXMuYXBwVmVyc2lvbn1gO1xuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkIHRoZSBmdWxsIHF1ZXJ5IHBhdGgsIGNvbWJpbmluZyB0aGUgcGF0aCB3aXRoIHRoZSBxdWVyeSBwYXJhbXMgaWYgdGhlXG4gICAqIHZlcmIgaXMgJ0dFVCcuIEZvciBleGFtcGxlOiAnL2Zvby9iYXI/YmF6PXF1eCdcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgcGF0aCBhbmQgcGFyYW1zIGNvbWJpbmVkIGludG8gb25lIHN0cmluZy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bGxRdWVyeVBhdGgoKSB7XG4gICAgaWYgKHRoaXMudmVyYiA9PT0gJ1BPU1QnIHx8IHRoaXMudmVyYiA9PT0gJ1BBVENIJykgeyByZXR1cm4gdGhpcy5wYXRoOyB9XG4gICAgZWxzZSB7IHJldHVybiBgJHt0aGlzLnBhdGh9PyR7cXMuc3RyaW5naWZ5KHRoaXMucGFyYW1zLCB7IGFycmF5Rm9ybWF0OiAnY29tbWEnIH0pfWA7IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIEF1dGhvcml6YXRpb24gaGVhZGVyIGlmIHRoZSBCZWFyZXJUb2tlbiBpcyBwcmVzZW50XG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBhZGRBdXRob3JpemF0aW9uSGVhZGVyKCkge1xuICAgIGlmICghdGhpcy5iZWFyZXJUb2tlbikgeyByZXR1cm47IH1cbiAgICB0aGlzLmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9IGBCZWFyZXIgJHt0aGlzLmJlYXJlclRva2VufWA7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBDb250ZW50LVR5cGUgaGVhZGVyIGlmIHRoZSBIVFRQIG1ldGhvZCBlcXVhbHMgUE9TVFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYWRkQ29udGVudFR5cGVIZWFkZXIoKSB7XG4gICAgaWYgKHRoaXMudmVyYiA9PT0gJ1BPU1QnICYmICF0aGlzLmJlYXJlclRva2VuKSB7XG4gICAgICB0aGlzLmhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24vdm5kLmFtYWRldXMranNvbic7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAqIEFkZHMgSFRUUE92ZXJyaWRlIG1ldGhvZCBpZiBpdCBpcyByZXF1aXJlZFxuICAqXG4gICogIEBwcml2YXRlXG4gICovXG4gIGFkZEhUVFBPdmVycmlkZUhlYWRlcigpIHtcbiAgICBpZiAodGhpcy52ZXJiID09PSAnUE9TVCcgJiYgdGhpcy5MaXN0SFRUUE92ZXJyaWRlLmluY2x1ZGVzKHRoaXMucGF0aCkpIHtcbiAgICAgIHRoaXMuaGVhZGVyc1snWC1IVFRQLU1ldGhvZC1PdmVycmlkZSddID0gJ0dFVCc7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXF1ZXN0O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxHQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFBb0IsU0FBQUQsdUJBQUFFLENBQUEsV0FBQUEsQ0FBQSxJQUFBQSxDQUFBLENBQUFDLFVBQUEsR0FBQUQsQ0FBQSxnQkFBQUEsQ0FBQTtBQUFBLFNBQUFFLFFBQUFDLENBQUEsc0NBQUFELE9BQUEsd0JBQUFFLE1BQUEsdUJBQUFBLE1BQUEsQ0FBQUMsUUFBQSxhQUFBRixDQUFBLGtCQUFBQSxDQUFBLGdCQUFBQSxDQUFBLFdBQUFBLENBQUEseUJBQUFDLE1BQUEsSUFBQUQsQ0FBQSxDQUFBRyxXQUFBLEtBQUFGLE1BQUEsSUFBQUQsQ0FBQSxLQUFBQyxN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