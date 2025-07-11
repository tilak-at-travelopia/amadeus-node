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
        this.client.logger.log(JSON.stringify(response.body, null, 2));
        if (response.parsed && response.result) {
          this.client.logger.log('Parsed Result:');
          this.client.logger.log(JSON.stringify(response.result, null, 2));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVzcG9uc2UiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl91dGlsIiwiX2Vycm9ycyIsImUiLCJfX2VzTW9kdWxlIiwiX3R5cGVvZiIsIm8iLCJTeW1ib2wiLCJpdGVyYXRvciIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiX2NsYXNzQ2FsbENoZWNrIiwiYSIsIm4iLCJUeXBlRXJyb3IiLCJfZGVmaW5lUHJvcGVydGllcyIsInIiLCJ0IiwibGVuZ3RoIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJfdG9Qcm9wZXJ0eUtleSIsImtleSIsIl9jcmVhdGVDbGFzcyIsImkiLCJfdG9QcmltaXRpdmUiLCJ0b1ByaW1pdGl2ZSIsImNhbGwiLCJTdHJpbmciLCJOdW1iZXIiLCJMaXN0ZW5lciIsInJlcXVlc3QiLCJlbWl0dGVyIiwiY2xpZW50IiwidmFsdWUiLCJvblJlc3BvbnNlIiwiaHR0cF9yZXNwb25zZSIsInJlc3BvbnNlIiwiUmVzcG9uc2UiLCJvbiIsImFkZENodW5rIiwiYmluZCIsIm9uRW5kIiwib25OZXR3b3JrRXJyb3IiLCJvbkVycm9yIiwiX3RoaXMiLCJwYXJzZSIsInN1Y2Nlc3MiLCJvblN1Y2Nlc3MiLCJvbkZhaWwiLCJsb2ciLCJlbWl0IiwiRXJyb3IiLCJlcnJvckZvciIsImVycm9yIiwiX3JlZiIsInN0YXR1c0NvZGUiLCJwYXJzZWQiLCJTZXJ2ZXJFcnJvciIsIkF1dGhlbnRpY2F0aW9uRXJyb3IiLCJOb3RGb3VuZEVycm9yIiwiQ2xpZW50RXJyb3IiLCJQYXJzZXJFcnJvciIsIlVua25vd25FcnJvciIsIl90aGlzMiIsIk5ldHdvcmtFcnJvciIsImRlYnVnIiwibG9nZ2VyIiwiY29uY2F0IiwiaGVhZGVycyIsIkpTT04iLCJzdHJpbmdpZnkiLCJib2R5IiwicmVzdWx0IiwiY29kZSIsImRlc2NyaXB0aW9uIiwid2FybiIsIl9kZWZhdWx0IiwiZXhwb3J0cyIsIm1vZHVsZSIsImRlZmF1bHQiXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYW1hZGV1cy9jbGllbnQvbGlzdGVuZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlc3BvbnNlIGZyb20gJy4vcmVzcG9uc2UnO1xuaW1wb3J0IHV0aWwgZnJvbSAndXRpbCc7XG5cbmltcG9ydCB7XG4gIFNlcnZlckVycm9yLFxuICBOb3RGb3VuZEVycm9yLFxuICBDbGllbnRFcnJvcixcbiAgUGFyc2VyRXJyb3IsXG4gIFVua25vd25FcnJvcixcbiAgTmV0d29ya0Vycm9yLFxuICBBdXRoZW50aWNhdGlvbkVycm9yLFxufSBmcm9tICcuL2Vycm9ycyc7XG5cblxuLyoqXG4gKiBMaXN0ZW4gdG8gY2hhbmdlcyBpbiB0aGUgSFRUUCByZXF1ZXN0IGFuZCBidWlsZCBSZXNwb25zZS9SZXNwb25zZUVycm9yXG4gKiBvYmplY3RzIGFjY29yZGluZ2x5LlxuICpcbiAqIEBwYXJhbSB7UmVxdWVzdH0gcmVxdWVzdCB0aGUgcmVxdWVzdCBvYmplY3QgdXNlZCB0byBtYWtlIHRoZSBjYWxsXG4gKiBAcGFyYW0ge0V2ZW50RW1pdHRlcn0gZW1pdHRlciBhIE5vZGUgZXZlbnQgZW1pdHRlclxuICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCB0aGUgY2xpZW50IGluc3RhbmNlIHRvIGxvZyByZXN1bHRzIHRvXG4gKiBAcHJvdGVjdGVkXG4gKi9cbmNsYXNzIExpc3RlbmVyIHtcbiAgY29uc3RydWN0b3IocmVxdWVzdCwgZW1pdHRlciwgY2xpZW50KSB7XG4gICAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgICB0aGlzLmVtaXR0ZXIgPSBlbWl0dGVyO1xuICAgIHRoaXMuY2xpZW50ID0gY2xpZW50O1xuICB9XG5cbiAgLy8gUFJPVEVDVEVEXG5cbiAgLyoqXG4gICAqIExpc3RlbnMgdG8gdmFyaW91cyBldmVudHMgb24gdGhlIGh0dHBfcmVzcG9uc2Ugb2JqZWN0LCBsaXN0ZW5pbmcgZm9yIGRhdGEsXG4gICAqIGNvbm5lY3Rpb25zIGNsb3NpbmcgZm9yIGJhZCByZWFzb25zLCBhbmQgdGhlIGVuZCBvZiB0aGUgcmVzcG9uc2UuXG4gICAqXG4gICAqIFVzZWQgYnkgdGhlIENsaWVudCB3aGVuIG1ha2luZyBhbiBBUEkgY2FsbC5cbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSBodHRwX3Jlc3BvbnNlIGEgTm9kZSBodHRwIHJlc3BvbnNlIG9iamVjdFxuICAgKiBAcHJvdGVjdGVkXG4gICAqL1xuICBvblJlc3BvbnNlKGh0dHBfcmVzcG9uc2UpIHtcbiAgICBsZXQgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoaHR0cF9yZXNwb25zZSwgdGhpcy5yZXF1ZXN0KTtcblxuICAgIGh0dHBfcmVzcG9uc2Uub24oJ2RhdGEnLCByZXNwb25zZS5hZGRDaHVuay5iaW5kKHJlc3BvbnNlKSk7XG4gICAgaHR0cF9yZXNwb25zZS5vbignZW5kJywgdGhpcy5vbkVuZChyZXNwb25zZSkuYmluZCh0aGlzKSk7XG4gICAgaHR0cF9yZXNwb25zZS5vbignY2xvc2UnLCB0aGlzLm9uTmV0d29ya0Vycm9yKHJlc3BvbnNlKS5iaW5kKHRoaXMpKTtcbiAgICBodHRwX3Jlc3BvbnNlLm9uKCdlcnJvcicsIHRoaXMub25OZXR3b3JrRXJyb3IocmVzcG9uc2UpLmJpbmQodGhpcykpO1xuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbnMgdG8gYSBuZXR3b3JrIGVycm9yIHdoZW4gbWFraW5nIGFuIEFQSSBjYWxsLlxuICAgKlxuICAgKiBVc2VkIGJ5IHRoZSBDbGllbnQgd2hlbiBtYWtpbmcgYW4gQVBJIGNhbGwuXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gaHR0cF9yZXNwb25zZSBhIE5vZGUgaHR0cCByZXNwb25zZSBvYmplY3RcbiAgICogQHByb3RlY3RlZFxuICAgKi9cblxuICBvbkVycm9yKGh0dHBfcmVzcG9uc2UpIHtcbiAgICBsZXQgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoaHR0cF9yZXNwb25zZSwgdGhpcy5yZXF1ZXN0KTtcbiAgICB0aGlzLm9uTmV0d29ya0Vycm9yKHJlc3BvbnNlKSgpO1xuICB9XG5cbiAgLy8gUFJJVkFURVxuXG4gIC8qKlxuICAgKiBXaGVuIHRoZSBjb25uZWN0aW9uIGVuZHMsIGNoZWNrIGlmIHRoZSByZXNwb25zZSBjYW4gYmUgcGFyc2VkIG9yIG5vdCBhbmRcbiAgICogYWN0IGFjY29yZGluZ2x5LlxuICAgKlxuICAgKiBAcGFyYW0gIHtSZXNwb25zZX0gcmVzcG9uc2VcbiAgICovXG4gIG9uRW5kKHJlc3BvbnNlKSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHJlc3BvbnNlLnBhcnNlKCk7XG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2VzcygpKSB7XG4gICAgICAgIHRoaXMub25TdWNjZXNzKHJlc3BvbnNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub25GYWlsKHJlc3BvbnNlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gdGhlIHJlc3BvbnNlIHdhcyBzdWNjZXNzZnVsLCByZXNvbHZlIHRoZSBwcm9taXNlIGFuZCByZXR1cm4gdGhlXG4gICAqIHJlc3BvbnNlIG9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0gIHtSZXNwb25zZX0gcmVzcG9uc2VcbiAgICovXG4gIG9uU3VjY2VzcyhyZXNwb25zZSkge1xuICAgIHRoaXMubG9nKHJlc3BvbnNlKTtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgncmVzb2x2ZScsIHJlc3BvbnNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIHRoZSBjb25uZWN0aW9uIHdhcyBub3Qgc3VjY2Vzc2Z1bCwgZGV0ZXJtaW5lIHRoZSByZWFzb24gYW5kIHJlc29sdmVcbiAgICogdGhlIHByb21pc2UgYWNjb3JkaW5nbHkuXG4gICAqXG4gICAqIEBwYXJhbSAge1Jlc3BvbnNlfSByZXNwb25zZVxuICAgKi9cbiAgb25GYWlsKHJlc3BvbnNlKSB7XG4gICAgbGV0IEVycm9yID0gdGhpcy5lcnJvckZvcihyZXNwb25zZSk7XG4gICAgbGV0IGVycm9yID0gbmV3IEVycm9yKHJlc3BvbnNlKTtcbiAgICB0aGlzLmxvZyhyZXNwb25zZSwgZXJyb3IpO1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdyZWplY3QnLCBlcnJvcik7XG4gIH1cblxuICAvKipcbiAgICogRmluZCB0aGUgcmlnaHQgZXJyb3IgZm9yIHRoZSBnaXZlbiByZXNwb25zZS5cbiAgICpcbiAgICogQHBhcmFtIHtSZXNwb25zZX0gcmVwb25zZVxuICAgKiBAcmV0dXJucyB7UmVzcG9uc2VFcnJvcn1cbiAgICovXG4gIGVycm9yRm9yKHsgc3RhdHVzQ29kZSwgcGFyc2VkIH0pIHtcbiAgICBsZXQgZXJyb3IgPSBudWxsO1xuICAgIGlmIChzdGF0dXNDb2RlID49IDUwMCkge1xuICAgICAgZXJyb3IgPSBTZXJ2ZXJFcnJvcjtcbiAgICB9IGVsc2UgaWYgKHN0YXR1c0NvZGUgPT09IDQwMSkge1xuICAgICAgZXJyb3IgPSBBdXRoZW50aWNhdGlvbkVycm9yO1xuICAgIH0gZWxzZSBpZiAoc3RhdHVzQ29kZSA9PT0gNDA0KSB7XG4gICAgICBlcnJvciA9IE5vdEZvdW5kRXJyb3I7XG4gICAgfSBlbHNlIGlmIChzdGF0dXNDb2RlID49IDQwMCkge1xuICAgICAgZXJyb3IgPSBDbGllbnRFcnJvcjtcbiAgICB9IGVsc2UgaWYgKCFwYXJzZWQpIHtcbiAgICAgIGVycm9yID0gUGFyc2VyRXJyb3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9yID0gVW5rbm93bkVycm9yO1xuICAgIH1cbiAgICByZXR1cm4gZXJyb3I7XG4gIH1cblxuICAvKipcbiAgICogV2hlbiB0aGUgY29ubmVjdGlvbiByYW4gaW50byBhIG5ldHdvcmsgZXJyb3IsIHJlamVjdCB0aGUgcHJvbWlzZSB3aXRoIGFcbiAgICogTmV0d29ya0Vycm9yLlxuICAgKlxuICAgKiBAcGFyYW0gIHtSZXNwb25zZX0gcmVzcG9uc2VcbiAgICovXG4gIG9uTmV0d29ya0Vycm9yKHJlc3BvbnNlKSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHJlc3BvbnNlLnBhcnNlKCk7XG4gICAgICBsZXQgZXJyb3IgPSBuZXcgTmV0d29ya0Vycm9yKHJlc3BvbnNlKTtcbiAgICAgIHRoaXMubG9nKHJlc3BvbnNlLCBlcnJvcik7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgncmVqZWN0JywgZXJyb3IpO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTG9ncyB0aGUgcmVzcG9uc2UsIHdoZW4gaW4gZGVidWcgbW9kZVxuICAgKlxuICAgKiBAcGFyYW0gIHtSZXNwb25zZX0gcmVzcG9uc2UgdGhlIHJlc3BvbnNlIG9iamVjdCB0byBsb2dcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGxvZyhyZXNwb25zZSwgZXJyb3IpIHtcbiAgICBpZiAodGhpcy5jbGllbnQuZGVidWcoKSkge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgIHRoaXMuY2xpZW50LmxvZ2dlci5sb2coJ1Jlc3BvbnNlOicpO1xuICAgICAgdGhpcy5jbGllbnQubG9nZ2VyLmxvZyhgU3RhdHVzOiAke3Jlc3BvbnNlLnN0YXR1c0NvZGV9YCk7XG5cbiAgICAgIGlmIChyZXNwb25zZS5oZWFkZXJzKSB7XG4gICAgICAgIHRoaXMuY2xpZW50LmxvZ2dlci5sb2coJ0hlYWRlcnM6JywgcmVzcG9uc2UuaGVhZGVycyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2xpZW50LmxvZ2dlci5sb2coJ0JvZHk6Jyk7XG4gICAgICB0aGlzLmNsaWVudC5sb2dnZXIubG9nKEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLmJvZHksIG51bGwsIDIpKTtcblxuICAgICAgaWYgKHJlc3BvbnNlLnBhcnNlZCAmJiByZXNwb25zZS5yZXN1bHQpIHtcbiAgICAgICAgdGhpcy5jbGllbnQubG9nZ2VyLmxvZygnUGFyc2VkIFJlc3VsdDonKTtcbiAgICAgICAgdGhpcy5jbGllbnQubG9nZ2VyLmxvZyhKU09OLnN0cmluZ2lmeShyZXNwb25zZS5yZXN1bHQsIG51bGwsIDIpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIHRoaXMuY2xpZW50LmxvZ2dlci5sb2coJ0Vycm9yOicsIGVycm9yLmNvZGUsIGVycm9yLmRlc2NyaXB0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCF0aGlzLmNsaWVudC5kZWJ1ZygpICYmIHRoaXMuY2xpZW50Lndhcm4oKSAmJiBlcnJvcikge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgIHRoaXMuY2xpZW50LmxvZ2dlci5sb2coJ0FtYWRldXMnLCBlcnJvci5jb2RlLCBlcnJvci5kZXNjcmlwdGlvbik7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExpc3RlbmVyO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxTQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxLQUFBLEdBQUFGLHNCQUFBLENBQUFDLE9BQUE7QUFFQSxJQUFBRSxPQUFBLEdBQUFGLE9BQUE7QUFRa0IsU0FBQUQsdUJBQUFJLENBQUEsV0FBQUEsQ0FBQSxJQUFBQSxDQUFBLENBQUFDLFVBQUEsR0FBQUQsQ0FBQSxnQkFBQUEsQ0FBQTtBQUFBLFNBQUFFLFFBQUFDLENBQUEsc0NBQUFELE9BQUEsd0JBQUFFLE1BQUEsdUJBQUFBLE1BQUEsQ0FBQUMsUUFBQSxhQUFBRixDQUFBLGtCQUFBQSxDQUFBLGdCQUFBQSxDQUFBLFdBQUFBLENBQUEseUJBQUFDLE1BQUEsSUFBQUQsQ0FBQSxDQUFBRyxXQUFBLEtBQUFGLE1BQUEsSUFBQUQsQ0FBQSxLQUFBQyxNQUFBLENBQUFHLFNBQUEscUJBQUFKLENBQUEsS0FBQUQsT0FBQSxDQUFBQyxDQUFBO0FBQUEsU0FBQUssZ0JBQUFDLENBQUEsRUFBQUMsQ0FBQSxVQUFBRCxDQUFBLFlBQUFDLENBQUEsYUFBQUMsU0FBQTtBQUFBLFNBQUFDLGtCQUFBWixDQUFBLEVBQUFhLENBQUEs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