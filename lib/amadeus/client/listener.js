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
        this.client.logger.log('Body:');
        this.client.logger.log(_util["default"].inspect(response.body, false, null));
        if (response.parsed && response.result) {
          this.client.logger.log('Parsed Result:');
          this.client.logger.log(_util["default"].inspect(response.result, false, null));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVzcG9uc2UiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl91dGlsIiwiX2Vycm9ycyIsImUiLCJfX2VzTW9kdWxlIiwiX3R5cGVvZiIsIm8iLCJTeW1ib2wiLCJpdGVyYXRvciIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiX2NsYXNzQ2FsbENoZWNrIiwiYSIsIm4iLCJUeXBlRXJyb3IiLCJfZGVmaW5lUHJvcGVydGllcyIsInIiLCJ0IiwibGVuZ3RoIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJfdG9Qcm9wZXJ0eUtleSIsImtleSIsIl9jcmVhdGVDbGFzcyIsImkiLCJfdG9QcmltaXRpdmUiLCJ0b1ByaW1pdGl2ZSIsImNhbGwiLCJTdHJpbmciLCJOdW1iZXIiLCJMaXN0ZW5lciIsInJlcXVlc3QiLCJlbWl0dGVyIiwiY2xpZW50IiwidmFsdWUiLCJvblJlc3BvbnNlIiwiaHR0cF9yZXNwb25zZSIsInJlc3BvbnNlIiwiUmVzcG9uc2UiLCJvbiIsImFkZENodW5rIiwiYmluZCIsIm9uRW5kIiwib25OZXR3b3JrRXJyb3IiLCJvbkVycm9yIiwiX3RoaXMiLCJwYXJzZSIsInN1Y2Nlc3MiLCJvblN1Y2Nlc3MiLCJvbkZhaWwiLCJsb2ciLCJlbWl0IiwiRXJyb3IiLCJlcnJvckZvciIsImVycm9yIiwiX3JlZiIsInN0YXR1c0NvZGUiLCJwYXJzZWQiLCJTZXJ2ZXJFcnJvciIsIkF1dGhlbnRpY2F0aW9uRXJyb3IiLCJOb3RGb3VuZEVycm9yIiwiQ2xpZW50RXJyb3IiLCJQYXJzZXJFcnJvciIsIlVua25vd25FcnJvciIsIl90aGlzMiIsIk5ldHdvcmtFcnJvciIsImRlYnVnIiwibG9nZ2VyIiwiY29uY2F0IiwiaGVhZGVycyIsInV0aWwiLCJpbnNwZWN0IiwiYm9keSIsInJlc3VsdCIsImNvZGUiLCJkZXNjcmlwdGlvbiIsIndhcm4iLCJfZGVmYXVsdCIsImV4cG9ydHMiLCJtb2R1bGUiLCJkZWZhdWx0Il0sInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FtYWRldXMvY2xpZW50L2xpc3RlbmVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZXNwb25zZSBmcm9tICcuL3Jlc3BvbnNlJztcbmltcG9ydCB1dGlsIGZyb20gJ3V0aWwnO1xuXG5pbXBvcnQge1xuICBTZXJ2ZXJFcnJvcixcbiAgTm90Rm91bmRFcnJvcixcbiAgQ2xpZW50RXJyb3IsXG4gIFBhcnNlckVycm9yLFxuICBVbmtub3duRXJyb3IsXG4gIE5ldHdvcmtFcnJvcixcbiAgQXV0aGVudGljYXRpb25FcnJvcixcbn0gZnJvbSAnLi9lcnJvcnMnO1xuXG5cbi8qKlxuICogTGlzdGVuIHRvIGNoYW5nZXMgaW4gdGhlIEhUVFAgcmVxdWVzdCBhbmQgYnVpbGQgUmVzcG9uc2UvUmVzcG9uc2VFcnJvclxuICogb2JqZWN0cyBhY2NvcmRpbmdseS5cbiAqXG4gKiBAcGFyYW0ge1JlcXVlc3R9IHJlcXVlc3QgdGhlIHJlcXVlc3Qgb2JqZWN0IHVzZWQgdG8gbWFrZSB0aGUgY2FsbFxuICogQHBhcmFtIHtFdmVudEVtaXR0ZXJ9IGVtaXR0ZXIgYSBOb2RlIGV2ZW50IGVtaXR0ZXJcbiAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgdGhlIGNsaWVudCBpbnN0YW5jZSB0byBsb2cgcmVzdWx0cyB0b1xuICogQHByb3RlY3RlZFxuICovXG5jbGFzcyBMaXN0ZW5lciB7XG4gIGNvbnN0cnVjdG9yKHJlcXVlc3QsIGVtaXR0ZXIsIGNsaWVudCkge1xuICAgIHRoaXMucmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgdGhpcy5lbWl0dGVyID0gZW1pdHRlcjtcbiAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcbiAgfVxuXG4gIC8vIFBST1RFQ1RFRFxuXG4gIC8qKlxuICAgKiBMaXN0ZW5zIHRvIHZhcmlvdXMgZXZlbnRzIG9uIHRoZSBodHRwX3Jlc3BvbnNlIG9iamVjdCwgbGlzdGVuaW5nIGZvciBkYXRhLFxuICAgKiBjb25uZWN0aW9ucyBjbG9zaW5nIGZvciBiYWQgcmVhc29ucywgYW5kIHRoZSBlbmQgb2YgdGhlIHJlc3BvbnNlLlxuICAgKlxuICAgKiBVc2VkIGJ5IHRoZSBDbGllbnQgd2hlbiBtYWtpbmcgYW4gQVBJIGNhbGwuXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gaHR0cF9yZXNwb25zZSBhIE5vZGUgaHR0cCByZXNwb25zZSBvYmplY3RcbiAgICogQHByb3RlY3RlZFxuICAgKi9cbiAgb25SZXNwb25zZShodHRwX3Jlc3BvbnNlKSB7XG4gICAgbGV0IHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGh0dHBfcmVzcG9uc2UsIHRoaXMucmVxdWVzdCk7XG5cbiAgICBodHRwX3Jlc3BvbnNlLm9uKCdkYXRhJywgcmVzcG9uc2UuYWRkQ2h1bmsuYmluZChyZXNwb25zZSkpO1xuICAgIGh0dHBfcmVzcG9uc2Uub24oJ2VuZCcsIHRoaXMub25FbmQocmVzcG9uc2UpLmJpbmQodGhpcykpO1xuICAgIGh0dHBfcmVzcG9uc2Uub24oJ2Nsb3NlJywgdGhpcy5vbk5ldHdvcmtFcnJvcihyZXNwb25zZSkuYmluZCh0aGlzKSk7XG4gICAgaHR0cF9yZXNwb25zZS5vbignZXJyb3InLCB0aGlzLm9uTmV0d29ya0Vycm9yKHJlc3BvbnNlKS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW5zIHRvIGEgbmV0d29yayBlcnJvciB3aGVuIG1ha2luZyBhbiBBUEkgY2FsbC5cbiAgICpcbiAgICogVXNlZCBieSB0aGUgQ2xpZW50IHdoZW4gbWFraW5nIGFuIEFQSSBjYWxsLlxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IGh0dHBfcmVzcG9uc2UgYSBOb2RlIGh0dHAgcmVzcG9uc2Ugb2JqZWN0XG4gICAqIEBwcm90ZWN0ZWRcbiAgICovXG5cbiAgb25FcnJvcihodHRwX3Jlc3BvbnNlKSB7XG4gICAgbGV0IHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGh0dHBfcmVzcG9uc2UsIHRoaXMucmVxdWVzdCk7XG4gICAgdGhpcy5vbk5ldHdvcmtFcnJvcihyZXNwb25zZSkoKTtcbiAgfVxuXG4gIC8vIFBSSVZBVEVcblxuICAvKipcbiAgICogV2hlbiB0aGUgY29ubmVjdGlvbiBlbmRzLCBjaGVjayBpZiB0aGUgcmVzcG9uc2UgY2FuIGJlIHBhcnNlZCBvciBub3QgYW5kXG4gICAqIGFjdCBhY2NvcmRpbmdseS5cbiAgICpcbiAgICogQHBhcmFtICB7UmVzcG9uc2V9IHJlc3BvbnNlXG4gICAqL1xuICBvbkVuZChyZXNwb25zZSkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICByZXNwb25zZS5wYXJzZSgpO1xuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MoKSkge1xuICAgICAgICB0aGlzLm9uU3VjY2VzcyhyZXNwb25zZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9uRmFpbChyZXNwb25zZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIHRoZSByZXNwb25zZSB3YXMgc3VjY2Vzc2Z1bCwgcmVzb2x2ZSB0aGUgcHJvbWlzZSBhbmQgcmV0dXJuIHRoZVxuICAgKiByZXNwb25zZSBvYmplY3RcbiAgICpcbiAgICogQHBhcmFtICB7UmVzcG9uc2V9IHJlc3BvbnNlXG4gICAqL1xuICBvblN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICB0aGlzLmxvZyhyZXNwb25zZSk7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Jlc29sdmUnLCByZXNwb25zZSk7XG4gIH1cblxuICAvKipcbiAgICogV2hlbiB0aGUgY29ubmVjdGlvbiB3YXMgbm90IHN1Y2Nlc3NmdWwsIGRldGVybWluZSB0aGUgcmVhc29uIGFuZCByZXNvbHZlXG4gICAqIHRoZSBwcm9taXNlIGFjY29yZGluZ2x5LlxuICAgKlxuICAgKiBAcGFyYW0gIHtSZXNwb25zZX0gcmVzcG9uc2VcbiAgICovXG4gIG9uRmFpbChyZXNwb25zZSkge1xuICAgIGxldCBFcnJvciA9IHRoaXMuZXJyb3JGb3IocmVzcG9uc2UpO1xuICAgIGxldCBlcnJvciA9IG5ldyBFcnJvcihyZXNwb25zZSk7XG4gICAgdGhpcy5sb2cocmVzcG9uc2UsIGVycm9yKTtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgncmVqZWN0JywgZXJyb3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIHJpZ2h0IGVycm9yIGZvciB0aGUgZ2l2ZW4gcmVzcG9uc2UuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVzcG9uc2V9IHJlcG9uc2VcbiAgICogQHJldHVybnMge1Jlc3BvbnNlRXJyb3J9XG4gICAqL1xuICBlcnJvckZvcih7IHN0YXR1c0NvZGUsIHBhcnNlZCB9KSB7XG4gICAgbGV0IGVycm9yID0gbnVsbDtcbiAgICBpZiAoc3RhdHVzQ29kZSA+PSA1MDApIHtcbiAgICAgIGVycm9yID0gU2VydmVyRXJyb3I7XG4gICAgfSBlbHNlIGlmIChzdGF0dXNDb2RlID09PSA0MDEpIHtcbiAgICAgIGVycm9yID0gQXV0aGVudGljYXRpb25FcnJvcjtcbiAgICB9IGVsc2UgaWYgKHN0YXR1c0NvZGUgPT09IDQwNCkge1xuICAgICAgZXJyb3IgPSBOb3RGb3VuZEVycm9yO1xuICAgIH0gZWxzZSBpZiAoc3RhdHVzQ29kZSA+PSA0MDApIHtcbiAgICAgIGVycm9yID0gQ2xpZW50RXJyb3I7XG4gICAgfSBlbHNlIGlmICghcGFyc2VkKSB7XG4gICAgICBlcnJvciA9IFBhcnNlckVycm9yO1xuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvciA9IFVua25vd25FcnJvcjtcbiAgICB9XG4gICAgcmV0dXJuIGVycm9yO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gdGhlIGNvbm5lY3Rpb24gcmFuIGludG8gYSBuZXR3b3JrIGVycm9yLCByZWplY3QgdGhlIHByb21pc2Ugd2l0aCBhXG4gICAqIE5ldHdvcmtFcnJvci5cbiAgICpcbiAgICogQHBhcmFtICB7UmVzcG9uc2V9IHJlc3BvbnNlXG4gICAqL1xuICBvbk5ldHdvcmtFcnJvcihyZXNwb25zZSkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICByZXNwb25zZS5wYXJzZSgpO1xuICAgICAgbGV0IGVycm9yID0gbmV3IE5ldHdvcmtFcnJvcihyZXNwb25zZSk7XG4gICAgICB0aGlzLmxvZyhyZXNwb25zZSwgZXJyb3IpO1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3JlamVjdCcsIGVycm9yKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIExvZ3MgdGhlIHJlc3BvbnNlLCB3aGVuIGluIGRlYnVnIG1vZGVcbiAgICpcbiAgICogQHBhcmFtICB7UmVzcG9uc2V9IHJlc3BvbnNlIHRoZSByZXNwb25zZSBvYmplY3QgdG8gbG9nXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBsb2cocmVzcG9uc2UsIGVycm9yKSB7XG4gICAgaWYgKHRoaXMuY2xpZW50LmRlYnVnKCkpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICB0aGlzLmNsaWVudC5sb2dnZXIubG9nKCdSZXNwb25zZTonKTtcbiAgICAgIHRoaXMuY2xpZW50LmxvZ2dlci5sb2coYFN0YXR1czogJHtyZXNwb25zZS5zdGF0dXNDb2RlfWApO1xuXG4gICAgICBpZiAocmVzcG9uc2UuaGVhZGVycykge1xuICAgICAgICB0aGlzLmNsaWVudC5sb2dnZXIubG9nKCdIZWFkZXJzOicsIHJlc3BvbnNlLmhlYWRlcnMpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNsaWVudC5sb2dnZXIubG9nKCdCb2R5OicpO1xuICAgICAgdGhpcy5jbGllbnQubG9nZ2VyLmxvZyh1dGlsLmluc3BlY3QocmVzcG9uc2UuYm9keSwgZmFsc2UsIG51bGwpKTtcblxuICAgICAgaWYgKHJlc3BvbnNlLnBhcnNlZCAmJiByZXNwb25zZS5yZXN1bHQpIHtcbiAgICAgICAgdGhpcy5jbGllbnQubG9nZ2VyLmxvZygnUGFyc2VkIFJlc3VsdDonKTtcbiAgICAgICAgdGhpcy5jbGllbnQubG9nZ2VyLmxvZyh1dGlsLmluc3BlY3QocmVzcG9uc2UucmVzdWx0LCBmYWxzZSwgbnVsbCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5jbGllbnQubG9nZ2VyLmxvZygnRXJyb3I6JywgZXJyb3IuY29kZSwgZXJyb3IuZGVzY3JpcHRpb24pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIXRoaXMuY2xpZW50LmRlYnVnKCkgJiYgdGhpcy5jbGllbnQud2FybigpICYmIGVycm9yKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgdGhpcy5jbGllbnQubG9nZ2VyLmxvZygnQW1hZGV1cycsIGVycm9yLmNvZGUsIGVycm9yLmRlc2NyaXB0aW9uKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGlzdGVuZXI7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLFNBQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLEtBQUEsR0FBQUYsc0JBQUEsQ0FBQUMsT0FBQTtBQUVBLElBQUFFLE9BQUEsR0FBQUYsT0FBQTtBQVFrQixTQUFBRCx1QkFBQUksQ0FBQSxXQUFBQSxDQUFBLElBQUFBLENBQUEsQ0FBQUMsVUFBQSxHQUFBRCxDQUFBLGdCQUFBQSxDQUFBO0FBQUEsU0FBQUUsUUFBQUMsQ0FBQSxzQ0FBQUQsT0FBQSx3QkFBQUUsTUFBQSx1QkFBQUEsTUFBQSxDQUFBQyxRQUFBLGFBQUFGLENBQUEsa0JBQUFBLENBQUEsZ0JBQUFBLENBQUEsV0FBQUEsQ0FBQSx5QkFBQUMsTUFBQSxJQUFBRCxDQUFBLENBQUFHLFdBQUEsS0FBQUYsTUFBQSxJQUFBRCxDQUFBLEtBQUFDLE1BQUEsQ0FBQUcsU0FBQSxxQkFBQUosQ0FBQSxLQUFBRCxPQUFBLENBQUFDLENBQUE7QUFBQSxTQUFBSyxnQkFBQUMsQ0FBQSxFQUFBQyxDQUFBLFVBQUFELENBQUEsWUFBQUMsQ0FBQSxhQUFBQyxTQUFBO0FBQUEsU0FBQUMsa0JBQUFaLENBQUEsRUFBQWEsQ0FB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