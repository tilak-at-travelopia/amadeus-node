"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _response = _interopRequireDefault(require("./response"));
var _util = _interopRequireDefault(require("util"));
var _errors = require("./errors");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Listen to changes in the HTTP request and build Response/ResponseError
 * objects accordingly.
 *
 * @param {Request} request the request object used to make the call
 * @param {EventEmitter} emitter a Node event emitter
 * @param {Client} client the client instance to log results to
 * @protected
 */
var Listener = /*#__PURE__*/function () {
  function Listener(request, emitter, client) {
    _classCallCheck(this, Listener);
    this.request = request;
    this.emitter = emitter;
    this.client = client;
  }

  // PROTECTED

  /**
   * Listens to various events on the http_response object, listening for data,
   * connections closing for bad reasons, and the end of the response.
   *
   * Used by the Client when making an API call.
   *
   * @param  {Object} http_response a Node http response object
   * @protected
   */
  return _createClass(Listener, [{
    key: "onResponse",
    value: function onResponse(http_response) {
      var response = new _response["default"](http_response, this.request);
      http_response.on('data', response.addChunk.bind(response));
      http_response.on('end', this.onEnd(response).bind(this));
      http_response.on('close', this.onNetworkError(response).bind(this));
      http_response.on('error', this.onNetworkError(response).bind(this));
    }

    /**
     * Listens to a network error when making an API call.
     *
     * Used by the Client when making an API call.
     *
     * @param  {Object} http_response a Node http response object
     * @protected
     */
  }, {
    key: "onError",
    value: function onError(http_response) {
      var response = new _response["default"](http_response, this.request);
      this.onNetworkError(response)();
    }

    // PRIVATE

    /**
     * When the connection ends, check if the response can be parsed or not and
     * act accordingly.
     *
     * @param  {Response} response
     */
  }, {
    key: "onEnd",
    value: function onEnd(response) {
      var _this = this;
      return function () {
        response.parse();
        if (response.success()) {
          _this.onSuccess(response);
        } else {
          _this.onFail(response);
        }
      };
    }

    /**
     * When the response was successful, resolve the promise and return the
     * response object
     *
     * @param  {Response} response
     */
  }, {
    key: "onSuccess",
    value: function onSuccess(response) {
      this.log(response);
      this.emitter.emit('resolve', response);
    }

    /**
     * When the connection was not successful, determine the reason and resolve
     * the promise accordingly.
     *
     * @param  {Response} response
     */
  }, {
    key: "onFail",
    value: function onFail(response) {
      var Error = this.errorFor(response);
      var error = new Error(response);
      this.log(response, error);
      this.emitter.emit('reject', error);
    }

    /**
     * Find the right error for the given response.
     *
     * @param {Response} reponse
     * @returns {ResponseError}
     */
  }, {
    key: "errorFor",
    value: function errorFor(_ref) {
      var statusCode = _ref.statusCode,
        parsed = _ref.parsed;
      var error = null;
      if (statusCode >= 500) {
        error = _errors.ServerError;
      } else if (statusCode === 401) {
        error = _errors.AuthenticationError;
      } else if (statusCode === 404) {
        error = _errors.NotFoundError;
      } else if (statusCode >= 400) {
        error = _errors.ClientError;
      } else if (!parsed) {
        error = _errors.ParserError;
      } else {
        error = _errors.UnknownError;
      }
      return error;
    }

    /**
     * When the connection ran into a network error, reject the promise with a
     * NetworkError.
     *
     * @param  {Response} response
     */
  }, {
    key: "onNetworkError",
    value: function onNetworkError(response) {
      var _this2 = this;
      return function () {
        response.parse();
        var error = new _errors.NetworkError(response);
        _this2.log(response, error);
        _this2.emitter.emit('reject', error);
      };
    }

    /**
     * Logs the response, when in debug mode
     *
     * @param  {Response} response the response object to log
     * @private
     */
  }, {
    key: "log",
    value: function log(response, error) {
      if (this.client.debug()) {
        /* istanbul ignore next */
        this.client.logger.log('Response:');
        this.client.logger.log("Status: ".concat(response.statusCode));
        if (response.headers) {
          this.client.logger.log('Headers:', response.headers);
        }
        this.client.logger.log('Body:', response.body);
        if (response.parsed && response.result) {
          this.client.logger.log('Parsed Result:', response.result);
        }
        if (error) {
          this.client.logger.log('Error:', error.code, error.description);
        }
      }
      if (!this.client.debug() && this.client.warn() && error) {
        /* istanbul ignore next */
        this.client.logger.log('Amadeus', error.code, error.description);
      }
    }
  }]);
}();
var _default = exports["default"] = Listener;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVzcG9uc2UiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl91dGlsIiwiX2Vycm9ycyIsImUiLCJfX2VzTW9kdWxlIiwiX3R5cGVvZiIsIm8iLCJTeW1ib2wiLCJpdGVyYXRvciIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiX2NsYXNzQ2FsbENoZWNrIiwiYSIsIm4iLCJUeXBlRXJyb3IiLCJfZGVmaW5lUHJvcGVydGllcyIsInIiLCJ0IiwibGVuZ3RoIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJfdG9Qcm9wZXJ0eUtleSIsImtleSIsIl9jcmVhdGVDbGFzcyIsImkiLCJfdG9QcmltaXRpdmUiLCJ0b1ByaW1pdGl2ZSIsImNhbGwiLCJTdHJpbmciLCJOdW1iZXIiLCJMaXN0ZW5lciIsInJlcXVlc3QiLCJlbWl0dGVyIiwiY2xpZW50IiwidmFsdWUiLCJvblJlc3BvbnNlIiwiaHR0cF9yZXNwb25zZSIsInJlc3BvbnNlIiwiUmVzcG9uc2UiLCJvbiIsImFkZENodW5rIiwiYmluZCIsIm9uRW5kIiwib25OZXR3b3JrRXJyb3IiLCJvbkVycm9yIiwiX3RoaXMiLCJwYXJzZSIsInN1Y2Nlc3MiLCJvblN1Y2Nlc3MiLCJvbkZhaWwiLCJsb2ciLCJlbWl0IiwiRXJyb3IiLCJlcnJvckZvciIsImVycm9yIiwiX3JlZiIsInN0YXR1c0NvZGUiLCJwYXJzZWQiLCJTZXJ2ZXJFcnJvciIsIkF1dGhlbnRpY2F0aW9uRXJyb3IiLCJOb3RGb3VuZEVycm9yIiwiQ2xpZW50RXJyb3IiLCJQYXJzZXJFcnJvciIsIlVua25vd25FcnJvciIsIl90aGlzMiIsIk5ldHdvcmtFcnJvciIsImRlYnVnIiwibG9nZ2VyIiwiY29uY2F0IiwiaGVhZGVycyIsImJvZHkiLCJyZXN1bHQiLCJjb2RlIiwiZGVzY3JpcHRpb24iLCJ3YXJuIiwiX2RlZmF1bHQiLCJleHBvcnRzIiwibW9kdWxlIiwiZGVmYXVsdCJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hbWFkZXVzL2NsaWVudC9saXN0ZW5lci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVzcG9uc2UgZnJvbSAnLi9yZXNwb25zZSc7XG5pbXBvcnQgdXRpbCBmcm9tICd1dGlsJztcblxuaW1wb3J0IHtcbiAgU2VydmVyRXJyb3IsXG4gIE5vdEZvdW5kRXJyb3IsXG4gIENsaWVudEVycm9yLFxuICBQYXJzZXJFcnJvcixcbiAgVW5rbm93bkVycm9yLFxuICBOZXR3b3JrRXJyb3IsXG4gIEF1dGhlbnRpY2F0aW9uRXJyb3IsXG59IGZyb20gJy4vZXJyb3JzJztcblxuXG4vKipcbiAqIExpc3RlbiB0byBjaGFuZ2VzIGluIHRoZSBIVFRQIHJlcXVlc3QgYW5kIGJ1aWxkIFJlc3BvbnNlL1Jlc3BvbnNlRXJyb3JcbiAqIG9iamVjdHMgYWNjb3JkaW5nbHkuXG4gKlxuICogQHBhcmFtIHtSZXF1ZXN0fSByZXF1ZXN0IHRoZSByZXF1ZXN0IG9iamVjdCB1c2VkIHRvIG1ha2UgdGhlIGNhbGxcbiAqIEBwYXJhbSB7RXZlbnRFbWl0dGVyfSBlbWl0dGVyIGEgTm9kZSBldmVudCBlbWl0dGVyXG4gKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IHRoZSBjbGllbnQgaW5zdGFuY2UgdG8gbG9nIHJlc3VsdHMgdG9cbiAqIEBwcm90ZWN0ZWRcbiAqL1xuY2xhc3MgTGlzdGVuZXIge1xuICBjb25zdHJ1Y3RvcihyZXF1ZXN0LCBlbWl0dGVyLCBjbGllbnQpIHtcbiAgICB0aGlzLnJlcXVlc3QgPSByZXF1ZXN0O1xuICAgIHRoaXMuZW1pdHRlciA9IGVtaXR0ZXI7XG4gICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG4gIH1cblxuICAvLyBQUk9URUNURURcblxuICAvKipcbiAgICogTGlzdGVucyB0byB2YXJpb3VzIGV2ZW50cyBvbiB0aGUgaHR0cF9yZXNwb25zZSBvYmplY3QsIGxpc3RlbmluZyBmb3IgZGF0YSxcbiAgICogY29ubmVjdGlvbnMgY2xvc2luZyBmb3IgYmFkIHJlYXNvbnMsIGFuZCB0aGUgZW5kIG9mIHRoZSByZXNwb25zZS5cbiAgICpcbiAgICogVXNlZCBieSB0aGUgQ2xpZW50IHdoZW4gbWFraW5nIGFuIEFQSSBjYWxsLlxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IGh0dHBfcmVzcG9uc2UgYSBOb2RlIGh0dHAgcmVzcG9uc2Ugb2JqZWN0XG4gICAqIEBwcm90ZWN0ZWRcbiAgICovXG4gIG9uUmVzcG9uc2UoaHR0cF9yZXNwb25zZSkge1xuICAgIGxldCByZXNwb25zZSA9IG5ldyBSZXNwb25zZShodHRwX3Jlc3BvbnNlLCB0aGlzLnJlcXVlc3QpO1xuXG4gICAgaHR0cF9yZXNwb25zZS5vbignZGF0YScsIHJlc3BvbnNlLmFkZENodW5rLmJpbmQocmVzcG9uc2UpKTtcbiAgICBodHRwX3Jlc3BvbnNlLm9uKCdlbmQnLCB0aGlzLm9uRW5kKHJlc3BvbnNlKS5iaW5kKHRoaXMpKTtcbiAgICBodHRwX3Jlc3BvbnNlLm9uKCdjbG9zZScsIHRoaXMub25OZXR3b3JrRXJyb3IocmVzcG9uc2UpLmJpbmQodGhpcykpO1xuICAgIGh0dHBfcmVzcG9uc2Uub24oJ2Vycm9yJywgdGhpcy5vbk5ldHdvcmtFcnJvcihyZXNwb25zZSkuYmluZCh0aGlzKSk7XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVucyB0byBhIG5ldHdvcmsgZXJyb3Igd2hlbiBtYWtpbmcgYW4gQVBJIGNhbGwuXG4gICAqXG4gICAqIFVzZWQgYnkgdGhlIENsaWVudCB3aGVuIG1ha2luZyBhbiBBUEkgY2FsbC5cbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSBodHRwX3Jlc3BvbnNlIGEgTm9kZSBodHRwIHJlc3BvbnNlIG9iamVjdFxuICAgKiBAcHJvdGVjdGVkXG4gICAqL1xuXG4gIG9uRXJyb3IoaHR0cF9yZXNwb25zZSkge1xuICAgIGxldCByZXNwb25zZSA9IG5ldyBSZXNwb25zZShodHRwX3Jlc3BvbnNlLCB0aGlzLnJlcXVlc3QpO1xuICAgIHRoaXMub25OZXR3b3JrRXJyb3IocmVzcG9uc2UpKCk7XG4gIH1cblxuICAvLyBQUklWQVRFXG5cbiAgLyoqXG4gICAqIFdoZW4gdGhlIGNvbm5lY3Rpb24gZW5kcywgY2hlY2sgaWYgdGhlIHJlc3BvbnNlIGNhbiBiZSBwYXJzZWQgb3Igbm90IGFuZFxuICAgKiBhY3QgYWNjb3JkaW5nbHkuXG4gICAqXG4gICAqIEBwYXJhbSAge1Jlc3BvbnNlfSByZXNwb25zZVxuICAgKi9cbiAgb25FbmQocmVzcG9uc2UpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgcmVzcG9uc2UucGFyc2UoKTtcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKCkpIHtcbiAgICAgICAgdGhpcy5vblN1Y2Nlc3MocmVzcG9uc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vbkZhaWwocmVzcG9uc2UpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogV2hlbiB0aGUgcmVzcG9uc2Ugd2FzIHN1Y2Nlc3NmdWwsIHJlc29sdmUgdGhlIHByb21pc2UgYW5kIHJldHVybiB0aGVcbiAgICogcmVzcG9uc2Ugb2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSAge1Jlc3BvbnNlfSByZXNwb25zZVxuICAgKi9cbiAgb25TdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgdGhpcy5sb2cocmVzcG9uc2UpO1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdyZXNvbHZlJywgcmVzcG9uc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gdGhlIGNvbm5lY3Rpb24gd2FzIG5vdCBzdWNjZXNzZnVsLCBkZXRlcm1pbmUgdGhlIHJlYXNvbiBhbmQgcmVzb2x2ZVxuICAgKiB0aGUgcHJvbWlzZSBhY2NvcmRpbmdseS5cbiAgICpcbiAgICogQHBhcmFtICB7UmVzcG9uc2V9IHJlc3BvbnNlXG4gICAqL1xuICBvbkZhaWwocmVzcG9uc2UpIHtcbiAgICBsZXQgRXJyb3IgPSB0aGlzLmVycm9yRm9yKHJlc3BvbnNlKTtcbiAgICBsZXQgZXJyb3IgPSBuZXcgRXJyb3IocmVzcG9uc2UpO1xuICAgIHRoaXMubG9nKHJlc3BvbnNlLCBlcnJvcik7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3JlamVjdCcsIGVycm9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIHRoZSByaWdodCBlcnJvciBmb3IgdGhlIGdpdmVuIHJlc3BvbnNlLlxuICAgKlxuICAgKiBAcGFyYW0ge1Jlc3BvbnNlfSByZXBvbnNlXG4gICAqIEByZXR1cm5zIHtSZXNwb25zZUVycm9yfVxuICAgKi9cbiAgZXJyb3JGb3IoeyBzdGF0dXNDb2RlLCBwYXJzZWQgfSkge1xuICAgIGxldCBlcnJvciA9IG51bGw7XG4gICAgaWYgKHN0YXR1c0NvZGUgPj0gNTAwKSB7XG4gICAgICBlcnJvciA9IFNlcnZlckVycm9yO1xuICAgIH0gZWxzZSBpZiAoc3RhdHVzQ29kZSA9PT0gNDAxKSB7XG4gICAgICBlcnJvciA9IEF1dGhlbnRpY2F0aW9uRXJyb3I7XG4gICAgfSBlbHNlIGlmIChzdGF0dXNDb2RlID09PSA0MDQpIHtcbiAgICAgIGVycm9yID0gTm90Rm91bmRFcnJvcjtcbiAgICB9IGVsc2UgaWYgKHN0YXR1c0NvZGUgPj0gNDAwKSB7XG4gICAgICBlcnJvciA9IENsaWVudEVycm9yO1xuICAgIH0gZWxzZSBpZiAoIXBhcnNlZCkge1xuICAgICAgZXJyb3IgPSBQYXJzZXJFcnJvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgZXJyb3IgPSBVbmtub3duRXJyb3I7XG4gICAgfVxuICAgIHJldHVybiBlcnJvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIHRoZSBjb25uZWN0aW9uIHJhbiBpbnRvIGEgbmV0d29yayBlcnJvciwgcmVqZWN0IHRoZSBwcm9taXNlIHdpdGggYVxuICAgKiBOZXR3b3JrRXJyb3IuXG4gICAqXG4gICAqIEBwYXJhbSAge1Jlc3BvbnNlfSByZXNwb25zZVxuICAgKi9cbiAgb25OZXR3b3JrRXJyb3IocmVzcG9uc2UpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgcmVzcG9uc2UucGFyc2UoKTtcbiAgICAgIGxldCBlcnJvciA9IG5ldyBOZXR3b3JrRXJyb3IocmVzcG9uc2UpO1xuICAgICAgdGhpcy5sb2cocmVzcG9uc2UsIGVycm9yKTtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdyZWplY3QnLCBlcnJvcik7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2dzIHRoZSByZXNwb25zZSwgd2hlbiBpbiBkZWJ1ZyBtb2RlXG4gICAqXG4gICAqIEBwYXJhbSAge1Jlc3BvbnNlfSByZXNwb25zZSB0aGUgcmVzcG9uc2Ugb2JqZWN0IHRvIGxvZ1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgbG9nKHJlc3BvbnNlLCBlcnJvcikge1xuICAgIGlmICh0aGlzLmNsaWVudC5kZWJ1ZygpKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgdGhpcy5jbGllbnQubG9nZ2VyLmxvZygnUmVzcG9uc2U6Jyk7XG4gICAgICB0aGlzLmNsaWVudC5sb2dnZXIubG9nKGBTdGF0dXM6ICR7cmVzcG9uc2Uuc3RhdHVzQ29kZX1gKTtcblxuICAgICAgaWYgKHJlc3BvbnNlLmhlYWRlcnMpIHtcbiAgICAgICAgdGhpcy5jbGllbnQubG9nZ2VyLmxvZygnSGVhZGVyczonLCByZXNwb25zZS5oZWFkZXJzKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jbGllbnQubG9nZ2VyLmxvZygnQm9keTonLCByZXNwb25zZS5ib2R5KTtcblxuICAgICAgaWYgKHJlc3BvbnNlLnBhcnNlZCAmJiByZXNwb25zZS5yZXN1bHQpIHtcbiAgICAgICAgdGhpcy5jbGllbnQubG9nZ2VyLmxvZygnUGFyc2VkIFJlc3VsdDonLCByZXNwb25zZS5yZXN1bHQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5jbGllbnQubG9nZ2VyLmxvZygnRXJyb3I6JywgZXJyb3IuY29kZSwgZXJyb3IuZGVzY3JpcHRpb24pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIXRoaXMuY2xpZW50LmRlYnVnKCkgJiYgdGhpcy5jbGllbnQud2FybigpICYmIGVycm9yKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgdGhpcy5jbGllbnQubG9nZ2VyLmxvZygnQW1hZGV1cycsIGVycm9yLmNvZGUsIGVycm9yLmRlc2NyaXB0aW9uKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGlzdGVuZXI7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLFNBQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLEtBQUEsR0FBQUYsc0JBQUEsQ0FBQUMsT0FBQTtBQUVBLElBQUFFLE9BQUEsR0FBQUYsT0FBQTtBQVFrQixTQUFBRCx1QkFBQUksQ0FBQSxXQUFBQSxDQUFBLElBQUFBLENBQUEsQ0FBQUMsVUFBQSxHQUFBRCxDQUFBLGdCQUFBQSxDQUFBO0FBQUEsU0FBQUUsUUFBQUMsQ0FBQSxzQ0FBQUQsT0FBQSx3QkFBQUUsTUFBQSx1QkFBQUEsTUFBQSxDQUFBQyxRQUFBLGFBQUFGLENBQUEsa0JBQUFBLENBQUEsZ0JBQUFBLENBQUEsV0FBQUEsQ0FBQSx5QkFBQUMsTUFBQSxJQUFBRCxDQUFBLENBQUFHLFdBQUEsS0FBQUYsTUFBQSxJQUFBRCxDQUFBLEtBQUFDLE1BQUEsQ0FBQUcsU0FBQSxxQkFBQUosQ0FBQSxLQUFBRCxPQUFBLENBQUFDLENBQUE7QUFBQSxTQUFBSyxnQkFBQUMsQ0FBQSxFQUFBQyxDQUFBLFVBQUFELENBQUEsWUFBQUMsQ0FBQSxhQUFBQyxTQUFBO0FBQUEsU0FBQUMsa0JBQUFaLENBQUEsRUFBQWEsQ0FBQSxhQUFBQyxDQUFBLE1BQUFBLENBQUEsR0FBQUQsQ0FBQSxDQUFBRSxNQUFBLEVBQUFELENBQUEsVUFBQVgsQ0FBQSxHQUFBVSxDQUFBLENBQUFDLENBQUEsR0FBQVgsQ0FBQSxDQUFBYSxVQUFBLEdBQUFiLENBQUEsQ0FBQWEsVUFBQSxR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LFNBQUFnQixHQUFHQSxDQUFDYixRQUFRLEVBQUVpQixLQUFLLEVBQUU7TUFDbkIsSUFBSSxJQUFJLENBQUNyQixNQUFNLENBQUNpQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1FBQ3ZCO1FBQ0EsSUFBSSxDQUFDakMsTUFBTSxDQUFDa0MsTUFBTSxDQUFDakIsR0FBRyxDQUFDLFdBQVcsQ0FBQztRQUNuQyxJQUFJLENBQUNqQixNQUFNLENBQUNrQyxNQUFNLENBQUNqQixHQUFHLFlBQUFrQixNQUFBLENBQVkvQixRQUFRLENBQUNtQixVQUFVLENBQUUsQ0FBQztRQUV4RCxJQUFJbkIsUUFBUSxDQUFDZ0MsT0FBTyxFQUFFO1VBQ3BCLElBQUksQ0FBQ3BDLE1BQU0sQ0FBQ2tDLE1BQU0sQ0FBQ2pCLEdBQUcsQ0FBQyxVQUFVLEVBQUViLFFBQVEsQ0FBQ2dDLE9BQU8sQ0FBQztRQUN0RDtRQUVBLElBQUksQ0FBQ3BDLE1BQU0sQ0FBQ2tDLE1BQU0sQ0FBQ2pCLEdBQUcsQ0FBQyxPQUFPLEVBQUViLFFBQVEsQ0FBQ2lDLElBQUksQ0FBQztRQUU5QyxJQUFJakMsUUFBUSxDQUFDb0IsTUFBTSxJQUFJcEIsUUFBUSxDQUFDa0MsTUFBTSxFQUFFO1VBQ3RDLElBQUksQ0FBQ3RDLE1BQU0sQ0FBQ2tDLE1BQU0sQ0FBQ2pCLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRWIsUUFBUSxDQUFDa0MsTUFBTSxDQUFDO1FBQzNEO1FBRUEsSUFBSWpCLEtBQUssRUFBRTtVQUNULElBQUksQ0FBQ3JCLE1BQU0sQ0FBQ2tDLE1BQU0sQ0FBQ2pCLEdBQUcsQ0FBQyxRQUFRLEVBQUVJLEtBQUssQ0FBQ2tCLElBQUksRUFBRWxCLEtBQUssQ0FBQ21CLFdBQVcsQ0FBQztRQUNqRTtNQUNGO01BQ0EsSUFBSSxDQUFDLElBQUksQ0FBQ3hDLE1BQU0sQ0FBQ2lDLEtBQUssQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDakMsTUFBTSxDQUFDeUMsSUFBSSxDQUFDLENBQUMsSUFBSXBCLEtBQUssRUFBRTtRQUN2RDtRQUNBLElBQUksQ0FBQ3JCLE1BQU0sQ0FBQ2tDLE1BQU0sQ0FBQ2pCLEdBQUcsQ0FBQyxTQUFTLEVBQUVJLEtBQUssQ0FBQ2tCLElBQUksRUFBRWxCLEtBQUssQ0FBQ21CLFdBQVcsQ0FBQztNQUNsRTtJQUNGO0VBQUM7QUFBQTtBQUFBLElBQUFFLFFBQUEsR0FBQUMsT0FBQSxjQUdZOUMsUUFBUTtBQUFBK0MsTUFBQSxDQUFBRCxPQUFBLEdBQUFBLE9BQUEsQ0FBQUUsT0FBQSIsImlnbm9yZUxpc3QiOltdfQ==