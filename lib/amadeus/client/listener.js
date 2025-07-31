"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _response = _interopRequireDefault(require("./response"));
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
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
        // Save request to file before processing response
        _this.saveRequestToFile(_this.request);
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
      this.saveResponseToFile(response);
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
      this.saveResponseToFile(response, error);
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
        _this2.saveResponseToFile(response, error);
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

    /**
     * Saves request data to a file if saveToFile is enabled
     *
     * @param {Request} request the request object to save
     * @private
     */
  }, {
    key: "saveRequestToFile",
    value: function saveRequestToFile(request) {
      if (this.client.saveToFile) {
        try {
          var timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          var sanitizedPath = request.path.replace(/\//g, '_').replace(/[?&=]/g, '-');
          var filename = "request_".concat(request.verb, "_").concat(sanitizedPath, "_").concat(timestamp, ".json");
          var logDir = this.client.logDirectory || 'logs';

          // Create logs directory if it doesn't exist
          if (!_fs["default"].existsSync(logDir)) {
            _fs["default"].mkdirSync(logDir, {
              recursive: true
            });
          }
          var filePath = _path["default"].join(logDir, filename);
          var requestData = {
            timestamp: new Date().toISOString(),
            method: request.verb,
            path: request.path,
            headers: request.options().headers,
            body: request.body(),
            params: request.params
          };
          _fs["default"].writeFileSync(filePath, JSON.stringify(requestData, null, 2));
          if (this.client.debug()) {
            this.client.logger.log("Request saved to ".concat(filePath));
          }
        } catch (err) {
          if (this.client.warn()) {
            this.client.logger.log("Failed to save request to file: ".concat(err.message));
          }
        }
      }
    }

    /**
     * Saves response data to a file if saveToFile is enabled
     *
     * @param {Response} response the response object to save
     * @param {Error} [error] optional error object
     * @private
     */
  }, {
    key: "saveResponseToFile",
    value: function saveResponseToFile(response) {
      var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (this.client.saveToFile) {
        try {
          var timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          var sanitizedPath = response.request.path.replace(/\//g, '_').replace(/[?&=]/g, '-');
          var filename = "response_".concat(response.request.verb, "_").concat(sanitizedPath, "_").concat(timestamp, ".json");
          var logDir = this.client.logDirectory || 'logs';

          // Create logs directory if it doesn't exist
          if (!_fs["default"].existsSync(logDir)) {
            _fs["default"].mkdirSync(logDir, {
              recursive: true
            });
          }
          var filePath = _path["default"].join(logDir, filename);
          var responseData = {
            timestamp: new Date().toISOString(),
            statusCode: response.statusCode,
            headers: response.headers,
            body: response.body,
            parsed: response.parsed,
            result: response.result,
            error: error ? {
              code: error.code,
              description: error.description
            } : null
          };
          _fs["default"].writeFileSync(filePath, JSON.stringify(responseData, null, 2));
          if (this.client.debug()) {
            this.client.logger.log("Response saved to ".concat(filePath));
          }
        } catch (err) {
          if (this.client.warn()) {
            this.client.logger.log("Failed to save response to file: ".concat(err.message));
          }
        }
      }
    }
  }]);
}();
var _default = exports["default"] = Listener;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVzcG9uc2UiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9mcyIsIl9wYXRoIiwiX2Vycm9ycyIsImUiLCJfX2VzTW9kdWxlIiwiX3R5cGVvZiIsIm8iLCJTeW1ib2wiLCJpdGVyYXRvciIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiX2NsYXNzQ2FsbENoZWNrIiwiYSIsIm4iLCJUeXBlRXJyb3IiLCJfZGVmaW5lUHJvcGVydGllcyIsInIiLCJ0IiwibGVuZ3RoIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJfdG9Qcm9wZXJ0eUtleSIsImtleSIsIl9jcmVhdGVDbGFzcyIsImkiLCJfdG9QcmltaXRpdmUiLCJ0b1ByaW1pdGl2ZSIsImNhbGwiLCJTdHJpbmciLCJOdW1iZXIiLCJMaXN0ZW5lciIsInJlcXVlc3QiLCJlbWl0dGVyIiwiY2xpZW50IiwidmFsdWUiLCJvblJlc3BvbnNlIiwiaHR0cF9yZXNwb25zZSIsInJlc3BvbnNlIiwiUmVzcG9uc2UiLCJvbiIsImFkZENodW5rIiwiYmluZCIsIm9uRW5kIiwib25OZXR3b3JrRXJyb3IiLCJvbkVycm9yIiwiX3RoaXMiLCJwYXJzZSIsInNhdmVSZXF1ZXN0VG9GaWxlIiwic3VjY2VzcyIsIm9uU3VjY2VzcyIsIm9uRmFpbCIsImxvZyIsInNhdmVSZXNwb25zZVRvRmlsZSIsImVtaXQiLCJFcnJvciIsImVycm9yRm9yIiwiZXJyb3IiLCJfcmVmIiwic3RhdHVzQ29kZSIsInBhcnNlZCIsIlNlcnZlckVycm9yIiwiQXV0aGVudGljYXRpb25FcnJvciIsIk5vdEZvdW5kRXJyb3IiLCJDbGllbnRFcnJvciIsIlBhcnNlckVycm9yIiwiVW5rbm93bkVycm9yIiwiX3RoaXMyIiwiTmV0d29ya0Vycm9yIiwiZGVidWciLCJsb2dnZXIiLCJjb25jYXQiLCJoZWFkZXJzIiwiSlNPTiIsInN0cmluZ2lmeSIsImJvZHkiLCJyZXN1bHQiLCJjb2RlIiwiZGVzY3JpcHRpb24iLCJ3YXJuIiwic2F2ZVRvRmlsZSIsInRpbWVzdGFtcCIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsInJlcGxhY2UiLCJzYW5pdGl6ZWRQYXRoIiwicGF0aCIsImZpbGVuYW1lIiwidmVyYiIsImxvZ0RpciIsImxvZ0RpcmVjdG9yeSIsImZzIiwiZXhpc3RzU3luYyIsIm1rZGlyU3luYyIsInJlY3Vyc2l2ZSIsImZpbGVQYXRoIiwiam9pbiIsInJlcXVlc3REYXRhIiwibWV0aG9kIiwib3B0aW9ucyIsInBhcmFtcyIsIndyaXRlRmlsZVN5bmMiLCJlcnIiLCJtZXNzYWdlIiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwicmVzcG9uc2VEYXRhIiwiX2RlZmF1bHQiLCJleHBvcnRzIiwibW9kdWxlIiwiZGVmYXVsdCJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hbWFkZXVzL2NsaWVudC9saXN0ZW5lci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVzcG9uc2UgZnJvbSAnLi9yZXNwb25zZSc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCB7XG4gIFNlcnZlckVycm9yLFxuICBOb3RGb3VuZEVycm9yLFxuICBDbGllbnRFcnJvcixcbiAgUGFyc2VyRXJyb3IsXG4gIFVua25vd25FcnJvcixcbiAgTmV0d29ya0Vycm9yLFxuICBBdXRoZW50aWNhdGlvbkVycm9yLFxufSBmcm9tICcuL2Vycm9ycyc7XG5cbi8qKlxuICogTGlzdGVuIHRvIGNoYW5nZXMgaW4gdGhlIEhUVFAgcmVxdWVzdCBhbmQgYnVpbGQgUmVzcG9uc2UvUmVzcG9uc2VFcnJvclxuICogb2JqZWN0cyBhY2NvcmRpbmdseS5cbiAqXG4gKiBAcGFyYW0ge1JlcXVlc3R9IHJlcXVlc3QgdGhlIHJlcXVlc3Qgb2JqZWN0IHVzZWQgdG8gbWFrZSB0aGUgY2FsbFxuICogQHBhcmFtIHtFdmVudEVtaXR0ZXJ9IGVtaXR0ZXIgYSBOb2RlIGV2ZW50IGVtaXR0ZXJcbiAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgdGhlIGNsaWVudCBpbnN0YW5jZSB0byBsb2cgcmVzdWx0cyB0b1xuICogQHByb3RlY3RlZFxuICovXG5jbGFzcyBMaXN0ZW5lciB7XG4gIGNvbnN0cnVjdG9yKHJlcXVlc3QsIGVtaXR0ZXIsIGNsaWVudCkge1xuICAgIHRoaXMucmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgdGhpcy5lbWl0dGVyID0gZW1pdHRlcjtcbiAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcbiAgfVxuXG4gIC8vIFBST1RFQ1RFRFxuXG4gIC8qKlxuICAgKiBMaXN0ZW5zIHRvIHZhcmlvdXMgZXZlbnRzIG9uIHRoZSBodHRwX3Jlc3BvbnNlIG9iamVjdCwgbGlzdGVuaW5nIGZvciBkYXRhLFxuICAgKiBjb25uZWN0aW9ucyBjbG9zaW5nIGZvciBiYWQgcmVhc29ucywgYW5kIHRoZSBlbmQgb2YgdGhlIHJlc3BvbnNlLlxuICAgKlxuICAgKiBVc2VkIGJ5IHRoZSBDbGllbnQgd2hlbiBtYWtpbmcgYW4gQVBJIGNhbGwuXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gaHR0cF9yZXNwb25zZSBhIE5vZGUgaHR0cCByZXNwb25zZSBvYmplY3RcbiAgICogQHByb3RlY3RlZFxuICAgKi9cbiAgb25SZXNwb25zZShodHRwX3Jlc3BvbnNlKSB7XG4gICAgbGV0IHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGh0dHBfcmVzcG9uc2UsIHRoaXMucmVxdWVzdCk7XG5cbiAgICBodHRwX3Jlc3BvbnNlLm9uKCdkYXRhJywgcmVzcG9uc2UuYWRkQ2h1bmsuYmluZChyZXNwb25zZSkpO1xuICAgIGh0dHBfcmVzcG9uc2Uub24oJ2VuZCcsIHRoaXMub25FbmQocmVzcG9uc2UpLmJpbmQodGhpcykpO1xuICAgIGh0dHBfcmVzcG9uc2Uub24oJ2Nsb3NlJywgdGhpcy5vbk5ldHdvcmtFcnJvcihyZXNwb25zZSkuYmluZCh0aGlzKSk7XG4gICAgaHR0cF9yZXNwb25zZS5vbignZXJyb3InLCB0aGlzLm9uTmV0d29ya0Vycm9yKHJlc3BvbnNlKS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW5zIHRvIGEgbmV0d29yayBlcnJvciB3aGVuIG1ha2luZyBhbiBBUEkgY2FsbC5cbiAgICpcbiAgICogVXNlZCBieSB0aGUgQ2xpZW50IHdoZW4gbWFraW5nIGFuIEFQSSBjYWxsLlxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IGh0dHBfcmVzcG9uc2UgYSBOb2RlIGh0dHAgcmVzcG9uc2Ugb2JqZWN0XG4gICAqIEBwcm90ZWN0ZWRcbiAgICovXG5cbiAgb25FcnJvcihodHRwX3Jlc3BvbnNlKSB7XG4gICAgbGV0IHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGh0dHBfcmVzcG9uc2UsIHRoaXMucmVxdWVzdCk7XG4gICAgdGhpcy5vbk5ldHdvcmtFcnJvcihyZXNwb25zZSkoKTtcbiAgfVxuXG4gIC8vIFBSSVZBVEVcblxuICAvKipcbiAgICogV2hlbiB0aGUgY29ubmVjdGlvbiBlbmRzLCBjaGVjayBpZiB0aGUgcmVzcG9uc2UgY2FuIGJlIHBhcnNlZCBvciBub3QgYW5kXG4gICAqIGFjdCBhY2NvcmRpbmdseS5cbiAgICpcbiAgICogQHBhcmFtICB7UmVzcG9uc2V9IHJlc3BvbnNlXG4gICAqL1xuICBvbkVuZChyZXNwb25zZSkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICByZXNwb25zZS5wYXJzZSgpO1xuICAgICAgLy8gU2F2ZSByZXF1ZXN0IHRvIGZpbGUgYmVmb3JlIHByb2Nlc3NpbmcgcmVzcG9uc2VcbiAgICAgIHRoaXMuc2F2ZVJlcXVlc3RUb0ZpbGUodGhpcy5yZXF1ZXN0KTtcblxuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MoKSkge1xuICAgICAgICB0aGlzLm9uU3VjY2VzcyhyZXNwb25zZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9uRmFpbChyZXNwb25zZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIHRoZSByZXNwb25zZSB3YXMgc3VjY2Vzc2Z1bCwgcmVzb2x2ZSB0aGUgcHJvbWlzZSBhbmQgcmV0dXJuIHRoZVxuICAgKiByZXNwb25zZSBvYmplY3RcbiAgICpcbiAgICogQHBhcmFtICB7UmVzcG9uc2V9IHJlc3BvbnNlXG4gICAqL1xuICBvblN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICB0aGlzLmxvZyhyZXNwb25zZSk7XG4gICAgdGhpcy5zYXZlUmVzcG9uc2VUb0ZpbGUocmVzcG9uc2UpO1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdyZXNvbHZlJywgcmVzcG9uc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gdGhlIGNvbm5lY3Rpb24gd2FzIG5vdCBzdWNjZXNzZnVsLCBkZXRlcm1pbmUgdGhlIHJlYXNvbiBhbmQgcmVzb2x2ZVxuICAgKiB0aGUgcHJvbWlzZSBhY2NvcmRpbmdseS5cbiAgICpcbiAgICogQHBhcmFtICB7UmVzcG9uc2V9IHJlc3BvbnNlXG4gICAqL1xuICBvbkZhaWwocmVzcG9uc2UpIHtcbiAgICBsZXQgRXJyb3IgPSB0aGlzLmVycm9yRm9yKHJlc3BvbnNlKTtcbiAgICBsZXQgZXJyb3IgPSBuZXcgRXJyb3IocmVzcG9uc2UpO1xuICAgIHRoaXMubG9nKHJlc3BvbnNlLCBlcnJvcik7XG4gICAgdGhpcy5zYXZlUmVzcG9uc2VUb0ZpbGUocmVzcG9uc2UsIGVycm9yKTtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgncmVqZWN0JywgZXJyb3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIHJpZ2h0IGVycm9yIGZvciB0aGUgZ2l2ZW4gcmVzcG9uc2UuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVzcG9uc2V9IHJlcG9uc2VcbiAgICogQHJldHVybnMge1Jlc3BvbnNlRXJyb3J9XG4gICAqL1xuICBlcnJvckZvcih7IHN0YXR1c0NvZGUsIHBhcnNlZCB9KSB7XG4gICAgbGV0IGVycm9yID0gbnVsbDtcbiAgICBpZiAoc3RhdHVzQ29kZSA+PSA1MDApIHtcbiAgICAgIGVycm9yID0gU2VydmVyRXJyb3I7XG4gICAgfSBlbHNlIGlmIChzdGF0dXNDb2RlID09PSA0MDEpIHtcbiAgICAgIGVycm9yID0gQXV0aGVudGljYXRpb25FcnJvcjtcbiAgICB9IGVsc2UgaWYgKHN0YXR1c0NvZGUgPT09IDQwNCkge1xuICAgICAgZXJyb3IgPSBOb3RGb3VuZEVycm9yO1xuICAgIH0gZWxzZSBpZiAoc3RhdHVzQ29kZSA+PSA0MDApIHtcbiAgICAgIGVycm9yID0gQ2xpZW50RXJyb3I7XG4gICAgfSBlbHNlIGlmICghcGFyc2VkKSB7XG4gICAgICBlcnJvciA9IFBhcnNlckVycm9yO1xuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvciA9IFVua25vd25FcnJvcjtcbiAgICB9XG4gICAgcmV0dXJuIGVycm9yO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gdGhlIGNvbm5lY3Rpb24gcmFuIGludG8gYSBuZXR3b3JrIGVycm9yLCByZWplY3QgdGhlIHByb21pc2Ugd2l0aCBhXG4gICAqIE5ldHdvcmtFcnJvci5cbiAgICpcbiAgICogQHBhcmFtICB7UmVzcG9uc2V9IHJlc3BvbnNlXG4gICAqL1xuICBvbk5ldHdvcmtFcnJvcihyZXNwb25zZSkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICByZXNwb25zZS5wYXJzZSgpO1xuICAgICAgbGV0IGVycm9yID0gbmV3IE5ldHdvcmtFcnJvcihyZXNwb25zZSk7XG4gICAgICB0aGlzLmxvZyhyZXNwb25zZSwgZXJyb3IpO1xuICAgICAgdGhpcy5zYXZlUmVzcG9uc2VUb0ZpbGUocmVzcG9uc2UsIGVycm9yKTtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdyZWplY3QnLCBlcnJvcik7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2dzIHRoZSByZXNwb25zZSwgd2hlbiBpbiBkZWJ1ZyBtb2RlXG4gICAqXG4gICAqIEBwYXJhbSAge1Jlc3BvbnNlfSByZXNwb25zZSB0aGUgcmVzcG9uc2Ugb2JqZWN0IHRvIGxvZ1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgbG9nKHJlc3BvbnNlLCBlcnJvcikge1xuICAgIGlmICh0aGlzLmNsaWVudC5kZWJ1ZygpKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgdGhpcy5jbGllbnQubG9nZ2VyLmxvZygnUmVzcG9uc2U6Jyk7XG4gICAgICB0aGlzLmNsaWVudC5sb2dnZXIubG9nKGBTdGF0dXM6ICR7cmVzcG9uc2Uuc3RhdHVzQ29kZX1gKTtcblxuICAgICAgaWYgKHJlc3BvbnNlLmhlYWRlcnMpIHtcbiAgICAgICAgdGhpcy5jbGllbnQubG9nZ2VyLmxvZygnSGVhZGVyczonLCByZXNwb25zZS5oZWFkZXJzKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jbGllbnQubG9nZ2VyLmxvZygnQm9keTonKTtcbiAgICAgIHRoaXMuY2xpZW50LmxvZ2dlci5sb2coSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UuYm9keSwgbnVsbCwgMikpO1xuXG4gICAgICBpZiAocmVzcG9uc2UucGFyc2VkICYmIHJlc3BvbnNlLnJlc3VsdCkge1xuICAgICAgICB0aGlzLmNsaWVudC5sb2dnZXIubG9nKCdQYXJzZWQgUmVzdWx0OicpO1xuICAgICAgICB0aGlzLmNsaWVudC5sb2dnZXIubG9nKEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLnJlc3VsdCwgbnVsbCwgMikpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5jbGllbnQubG9nZ2VyLmxvZygnRXJyb3I6JywgZXJyb3IuY29kZSwgZXJyb3IuZGVzY3JpcHRpb24pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIXRoaXMuY2xpZW50LmRlYnVnKCkgJiYgdGhpcy5jbGllbnQud2FybigpICYmIGVycm9yKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgdGhpcy5jbGllbnQubG9nZ2VyLmxvZygnQW1hZGV1cycsIGVycm9yLmNvZGUsIGVycm9yLmRlc2NyaXB0aW9uKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2F2ZXMgcmVxdWVzdCBkYXRhIHRvIGEgZmlsZSBpZiBzYXZlVG9GaWxlIGlzIGVuYWJsZWRcbiAgICpcbiAgICogQHBhcmFtIHtSZXF1ZXN0fSByZXF1ZXN0IHRoZSByZXF1ZXN0IG9iamVjdCB0byBzYXZlXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzYXZlUmVxdWVzdFRvRmlsZShyZXF1ZXN0KSB7XG4gICAgaWYgKHRoaXMuY2xpZW50LnNhdmVUb0ZpbGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5yZXBsYWNlKC9bOi5dL2csICctJyk7XG4gICAgICAgIGNvbnN0IHNhbml0aXplZFBhdGggPSByZXF1ZXN0LnBhdGhcbiAgICAgICAgICAucmVwbGFjZSgvXFwvL2csICdfJylcbiAgICAgICAgICAucmVwbGFjZSgvWz8mPV0vZywgJy0nKTtcbiAgICAgICAgY29uc3QgZmlsZW5hbWUgPSBgcmVxdWVzdF8ke3JlcXVlc3QudmVyYn1fJHtzYW5pdGl6ZWRQYXRofV8ke3RpbWVzdGFtcH0uanNvbmA7XG4gICAgICAgIGNvbnN0IGxvZ0RpciA9IHRoaXMuY2xpZW50LmxvZ0RpcmVjdG9yeSB8fCAnbG9ncyc7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGxvZ3MgZGlyZWN0b3J5IGlmIGl0IGRvZXNuJ3QgZXhpc3RcbiAgICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKGxvZ0RpcikpIHtcbiAgICAgICAgICBmcy5ta2RpclN5bmMobG9nRGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKGxvZ0RpciwgZmlsZW5hbWUpO1xuXG4gICAgICAgIGNvbnN0IHJlcXVlc3REYXRhID0ge1xuICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgIG1ldGhvZDogcmVxdWVzdC52ZXJiLFxuICAgICAgICAgIHBhdGg6IHJlcXVlc3QucGF0aCxcbiAgICAgICAgICBoZWFkZXJzOiByZXF1ZXN0Lm9wdGlvbnMoKS5oZWFkZXJzLFxuICAgICAgICAgIGJvZHk6IHJlcXVlc3QuYm9keSgpLFxuICAgICAgICAgIHBhcmFtczogcmVxdWVzdC5wYXJhbXMsXG4gICAgICAgIH07XG5cbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgSlNPTi5zdHJpbmdpZnkocmVxdWVzdERhdGEsIG51bGwsIDIpKTtcblxuICAgICAgICBpZiAodGhpcy5jbGllbnQuZGVidWcoKSkge1xuICAgICAgICAgIHRoaXMuY2xpZW50LmxvZ2dlci5sb2coYFJlcXVlc3Qgc2F2ZWQgdG8gJHtmaWxlUGF0aH1gKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmICh0aGlzLmNsaWVudC53YXJuKCkpIHtcbiAgICAgICAgICB0aGlzLmNsaWVudC5sb2dnZXIubG9nKFxuICAgICAgICAgICAgYEZhaWxlZCB0byBzYXZlIHJlcXVlc3QgdG8gZmlsZTogJHtlcnIubWVzc2FnZX1gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlcyByZXNwb25zZSBkYXRhIHRvIGEgZmlsZSBpZiBzYXZlVG9GaWxlIGlzIGVuYWJsZWRcbiAgICpcbiAgICogQHBhcmFtIHtSZXNwb25zZX0gcmVzcG9uc2UgdGhlIHJlc3BvbnNlIG9iamVjdCB0byBzYXZlXG4gICAqIEBwYXJhbSB7RXJyb3J9IFtlcnJvcl0gb3B0aW9uYWwgZXJyb3Igb2JqZWN0XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzYXZlUmVzcG9uc2VUb0ZpbGUocmVzcG9uc2UsIGVycm9yID0gbnVsbCkge1xuICAgIGlmICh0aGlzLmNsaWVudC5zYXZlVG9GaWxlKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgvWzouXS9nLCAnLScpO1xuICAgICAgICBjb25zdCBzYW5pdGl6ZWRQYXRoID0gcmVzcG9uc2UucmVxdWVzdC5wYXRoXG4gICAgICAgICAgLnJlcGxhY2UoL1xcLy9nLCAnXycpXG4gICAgICAgICAgLnJlcGxhY2UoL1s/Jj1dL2csICctJyk7XG4gICAgICAgIGNvbnN0IGZpbGVuYW1lID0gYHJlc3BvbnNlXyR7cmVzcG9uc2UucmVxdWVzdC52ZXJifV8ke3Nhbml0aXplZFBhdGh9XyR7dGltZXN0YW1wfS5qc29uYDtcbiAgICAgICAgY29uc3QgbG9nRGlyID0gdGhpcy5jbGllbnQubG9nRGlyZWN0b3J5IHx8ICdsb2dzJztcblxuICAgICAgICAvLyBDcmVhdGUgbG9ncyBkaXJlY3RvcnkgaWYgaXQgZG9lc24ndCBleGlzdFxuICAgICAgICBpZiAoIWZzLmV4aXN0c1N5bmMobG9nRGlyKSkge1xuICAgICAgICAgIGZzLm1rZGlyU3luYyhsb2dEaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4obG9nRGlyLCBmaWxlbmFtZSk7XG5cbiAgICAgICAgY29uc3QgcmVzcG9uc2VEYXRhID0ge1xuICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgIHN0YXR1c0NvZGU6IHJlc3BvbnNlLnN0YXR1c0NvZGUsXG4gICAgICAgICAgaGVhZGVyczogcmVzcG9uc2UuaGVhZGVycyxcbiAgICAgICAgICBib2R5OiByZXNwb25zZS5ib2R5LFxuICAgICAgICAgIHBhcnNlZDogcmVzcG9uc2UucGFyc2VkLFxuICAgICAgICAgIHJlc3VsdDogcmVzcG9uc2UucmVzdWx0LFxuICAgICAgICAgIGVycm9yOiBlcnJvclxuICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgY29kZTogZXJyb3IuY29kZSxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZXJyb3IuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogbnVsbCxcbiAgICAgICAgfTtcblxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGZpbGVQYXRoLCBKU09OLnN0cmluZ2lmeShyZXNwb25zZURhdGEsIG51bGwsIDIpKTtcblxuICAgICAgICBpZiAodGhpcy5jbGllbnQuZGVidWcoKSkge1xuICAgICAgICAgIHRoaXMuY2xpZW50LmxvZ2dlci5sb2coYFJlc3BvbnNlIHNhdmVkIHRvICR7ZmlsZVBhdGh9YCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBpZiAodGhpcy5jbGllbnQud2FybigpKSB7XG4gICAgICAgICAgdGhpcy5jbGllbnQubG9nZ2VyLmxvZyhcbiAgICAgICAgICAgIGBGYWlsZWQgdG8gc2F2ZSByZXNwb25zZSB0byBmaWxlOiAke2Vyci5tZXNzYWdlfWBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExpc3RlbmVyO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxTQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxHQUFBLEdBQUFGLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBRSxLQUFBLEdBQUFILHNCQUFBLENBQUFDLE9BQUE7QUFFQSxJQUFBRyxPQUFBLEdBQUFILE9BQUE7QUFRa0IsU0FBQUQsdUJBQUFLLENBQUEsV0FBQUEsQ0FBQSxJQUFBQSxDQUFBLENBQUFDLFVBQUEsR0FBQUQsQ0FBQSxnQkFBQUEsQ0FBQTtBQUFBLFNBQUFFLFFBQUFDLENBQUEsc0NBQUFELE9BQUEsd0JBQUFFLE1BQUEsdUJBQUFBLE1BQUEsQ0FBQUMsUUFBQSxhQUFBRixDQUFBLGtCQUFBQSxDQUFBLGdCQUFBQSxDQUFBLFdBQUFBLENBQUEs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