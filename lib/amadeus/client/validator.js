"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _https = _interopRequireDefault(require("https"));
var _http = _interopRequireDefault(require("http"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var HOSTS = {
  test: 'test.api.amadeus.com',
  production: 'api.amadeus.com'
};
var RECOGNIZED_OPTIONS = ['clientId', 'clientSecret', 'logger', 'logLevel', 'hostname', 'host', 'customAppId', 'customAppVersion', 'http', 'ssl', 'port', 'headers', 'saveToFile', 'logDirectory'];

/**
 * Helper class for validating parameters
 * @protected
 */
var Validator = /*#__PURE__*/function () {
  function Validator() {
    _classCallCheck(this, Validator);
  }
  return _createClass(Validator, [{
    key: "validateAndInitialize",
    value:
    /**
     * Initialise the client's default value, ensuring the required values are
     * present
     *
     * @param  {Client} client the client object to set the defaults for
     * @param  {Object} options the associative array of options passed to the
     *  client on initialization
     */
    function validateAndInitialize(client, options) {
      this.initializeClientCredentials(client, options);
      this.initializeLogger(client, options);
      this.initializeHost(client, options);
      this.initializeCustomApp(client, options);
      this.initializeHttp(client, options);
      this.initializeHeaders(client, options);
      this.initializeFileLogging(client, options);
      this.warnOnUnrecognizedOptions(options, client, RECOGNIZED_OPTIONS);
    }

    // PRIVATE
  }, {
    key: "initializeClientCredentials",
    value: function initializeClientCredentials(client, options) {
      client.clientId = this.initRequired('clientId', options);
      client.clientSecret = this.initRequired('clientSecret', options);
    }
  }, {
    key: "initializeLogger",
    value: function initializeLogger(client, options) {
      client.logger = this.initOptional('logger', options, console);
      client.logLevel = this.initOptional('logLevel', options, 'silent');
    }
  }, {
    key: "initializeHost",
    value: function initializeHost(client, options) {
      var hostname = this.initOptional('hostname', options, 'test');
      client.host = this.initOptional('host', options, HOSTS[hostname]);
      client.port = this.initOptional('port', options, 443);
      client.ssl = this.initOptional('ssl', options, true);
    }
  }, {
    key: "initializeCustomApp",
    value: function initializeCustomApp(client, options) {
      client.customAppId = this.initOptional('customAppId', options);
      client.customAppVersion = this.initOptional('customAppVersion', options);
    }
  }, {
    key: "initializeHttp",
    value: function initializeHttp(client, options) {
      var network = client.ssl ? _https["default"] : _http["default"];
      client.http = this.initOptional('http', options, network);
    }
  }, {
    key: "initializeHeaders",
    value: function initializeHeaders(client, options) {
      client.customHeaders = this.initOptional('headers', options, {});
    }
  }, {
    key: "initializeFileLogging",
    value: function initializeFileLogging(client, options) {
      client.saveToFile = this.initOptional('saveToFile', options, false);
      client.logDirectory = this.initOptional('logDirectory', options, 'logs');
    }
  }, {
    key: "initRequired",
    value: function initRequired(key, options) {
      var result = this.initOptional(key, options);
      if (!result) throw new ArgumentError("Missing required argument: ".concat(key));
      return result;
    }
  }, {
    key: "initOptional",
    value: function initOptional(key, options) {
      var fallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      //Env variables names expected to be in SNAKE_CASE and uppercase
      var envKey = "AMADEUS_".concat(key.replace(/[A-Z]/g, function (c) {
        return "_".concat(c.toLowerCase());
      }).toUpperCase());
      var value = options[key] || process.env[envKey] || fallback;
      return value;
    }
  }, {
    key: "warnOnUnrecognizedOptions",
    value: function warnOnUnrecognizedOptions(options, client, recognizedOptions) {
      Object.keys(options).forEach(function (key) {
        if (recognizedOptions.indexOf(key) === -1 && client.warn()) {
          client.logger.log("Unrecognized option: ".concat(key));
        }
      });
      return null;
    }
  }]);
}(); // PRIVATE
var ArgumentError = /*#__PURE__*/function (_Error) {
  function ArgumentError(message) {
    var _this;
    _classCallCheck(this, ArgumentError);
    _this = _callSuper(this, ArgumentError, [message]);
    _this.name = 'ArgumentError';
    return _this;
  }
  _inherits(ArgumentError, _Error);
  return _createClass(ArgumentError);
}(/*#__PURE__*/_wrapNativeSuper(Error));
var _default = exports["default"] = Validator;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfaHR0cHMiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9odHRwIiwiZSIsIl9fZXNNb2R1bGUiLCJfY2FsbFN1cGVyIiwidCIsIm8iLCJfZ2V0UHJvdG90eXBlT2YiLCJfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybiIsIl9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QiLCJSZWZsZWN0IiwiY29uc3RydWN0IiwiY29uc3RydWN0b3IiLCJhcHBseSIsIl90eXBlb2YiLCJUeXBlRXJyb3IiLCJfYXNzZXJ0VGhpc0luaXRpYWxpemVkIiwiUmVmZXJlbmNlRXJyb3IiLCJfaW5oZXJpdHMiLCJwcm90b3R5cGUiLCJPYmplY3QiLCJjcmVhdGUiLCJ2YWx1ZSIsIndyaXRhYmxlIiwiY29uZmlndXJhYmxlIiwiZGVmaW5lUHJvcGVydHkiLCJfc2V0UHJvdG90eXBlT2YiLCJfd3JhcE5hdGl2ZVN1cGVyIiwiciIsIk1hcCIsIl9pc05hdGl2ZUZ1bmN0aW9uIiwiaGFzIiwiZ2V0Iiwic2V0IiwiV3JhcHBlciIsIl9jb25zdHJ1Y3QiLCJhcmd1bWVudHMiLCJlbnVtZXJhYmxlIiwicHVzaCIsInAiLCJiaW5kIiwiQm9vbGVhbiIsInZhbHVlT2YiLCJjYWxsIiwiRnVuY3Rpb24iLCJ0b1N0cmluZyIsImluZGV4T2YiLCJuIiwic2V0UHJvdG90eXBlT2YiLCJfX3Byb3RvX18iLCJnZXRQcm90b3R5cGVPZiIsIlN5bWJvbCIsIml0ZXJhdG9yIiwiX2NsYXNzQ2FsbENoZWNrIiwiYSIsIl9kZWZpbmVQcm9wZXJ0aWVzIiwibGVuZ3RoIiwiX3RvUHJvcGVydHlLZXkiLCJrZXkiLCJfY3JlYXRlQ2xhc3MiLCJpIiwiX3RvUHJpbWl0aXZlIiwidG9QcmltaXRpdmUiLCJTdHJpbmciLCJOdW1iZXIiLCJIT1NUUyIsInRlc3QiLCJwcm9kdWN0aW9uIiwiUkVDT0dOSVpFRF9PUFRJT05TIiwiVmFsaWRhdG9yIiwidmFsaWRhdGVBbmRJbml0aWFsaXplIiwiY2xpZW50Iiwib3B0aW9ucyIsImluaXRpYWxpemVDbGllbnRDcmVkZW50aWFscyIsImluaXRpYWxpemVMb2dnZXIiLCJpbml0aWFsaXplSG9zdCIsImluaXRpYWxpemVDdXN0b21BcHAiLCJpbml0aWFsaXplSHR0cCIsImluaXRpYWxpemVIZWFkZXJzIiwiaW5pdGlhbGl6ZUZpbGVMb2dnaW5nIiwid2Fybk9uVW5yZWNvZ25pemVkT3B0aW9ucyIsImNsaWVudElkIiwiaW5pdFJlcXVpcmVkIiwiY2xpZW50U2VjcmV0IiwibG9nZ2VyIiwiaW5pdE9wdGlvbmFsIiwiY29uc29sZSIsImxvZ0xldmVsIiwiaG9zdG5hbWUiLCJob3N0IiwicG9ydCIsInNzbCIsImN1c3RvbUFwcElkIiwiY3VzdG9tQXBwVmVyc2lvbiIsIm5ldHdvcmsiLCJodHRwcyIsImh0dHAiLCJjdXN0b21IZWFkZXJzIiwic2F2ZVRvRmlsZSIsImxvZ0RpcmVjdG9yeSIsInJlc3VsdCIsIkFyZ3VtZW50RXJyb3IiLCJjb25jYXQiLCJmYWxsYmFjayIsInVuZGVmaW5lZCIsImVudktleSIsInJlcGxhY2UiLCJjIiwidG9Mb3dlckNhc2UiLCJ0b1VwcGVyQ2FzZSIsInByb2Nlc3MiLCJlbnYiLCJyZWNvZ25pemVkT3B0aW9ucyIsImtleXMiLCJmb3JFYWNoIiwid2FybiIsImxvZyIsIl9FcnJvciIsIm1lc3NhZ2UiLCJfdGhpcyIsIm5hbWUiLCJFcnJvciIsIl9kZWZhdWx0IiwiZXhwb3J0cyIsIm1vZHVsZSIsImRlZmF1bHQiXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYW1hZGV1cy9jbGllbnQvdmFsaWRhdG9yLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBodHRwcyBmcm9tICdodHRwcyc7XG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcblxuY29uc3QgSE9TVFMgPSB7XG4gIHRlc3Q6ICd0ZXN0LmFwaS5hbWFkZXVzLmNvbScsXG4gIHByb2R1Y3Rpb246ICdhcGkuYW1hZGV1cy5jb20nLFxufTtcblxuY29uc3QgUkVDT0dOSVpFRF9PUFRJT05TID0gW1xuICAnY2xpZW50SWQnLFxuICAnY2xpZW50U2VjcmV0JyxcbiAgJ2xvZ2dlcicsXG4gICdsb2dMZXZlbCcsXG4gICdob3N0bmFtZScsXG4gICdob3N0JyxcbiAgJ2N1c3RvbUFwcElkJyxcbiAgJ2N1c3RvbUFwcFZlcnNpb24nLFxuICAnaHR0cCcsXG4gICdzc2wnLFxuICAncG9ydCcsXG4gICdoZWFkZXJzJyxcbiAgJ3NhdmVUb0ZpbGUnLFxuICAnbG9nRGlyZWN0b3J5Jyxcbl07XG5cbi8qKlxuICogSGVscGVyIGNsYXNzIGZvciB2YWxpZGF0aW5nIHBhcmFtZXRlcnNcbiAqIEBwcm90ZWN0ZWRcbiAqL1xuY2xhc3MgVmFsaWRhdG9yIHtcbiAgLyoqXG4gICAqIEluaXRpYWxpc2UgdGhlIGNsaWVudCdzIGRlZmF1bHQgdmFsdWUsIGVuc3VyaW5nIHRoZSByZXF1aXJlZCB2YWx1ZXMgYXJlXG4gICAqIHByZXNlbnRcbiAgICpcbiAgICogQHBhcmFtICB7Q2xpZW50fSBjbGllbnQgdGhlIGNsaWVudCBvYmplY3QgdG8gc2V0IHRoZSBkZWZhdWx0cyBmb3JcbiAgICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zIHRoZSBhc3NvY2lhdGl2ZSBhcnJheSBvZiBvcHRpb25zIHBhc3NlZCB0byB0aGVcbiAgICogIGNsaWVudCBvbiBpbml0aWFsaXphdGlvblxuICAgKi9cbiAgdmFsaWRhdGVBbmRJbml0aWFsaXplKGNsaWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuaW5pdGlhbGl6ZUNsaWVudENyZWRlbnRpYWxzKGNsaWVudCwgb3B0aW9ucyk7XG4gICAgdGhpcy5pbml0aWFsaXplTG9nZ2VyKGNsaWVudCwgb3B0aW9ucyk7XG4gICAgdGhpcy5pbml0aWFsaXplSG9zdChjbGllbnQsIG9wdGlvbnMpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZUN1c3RvbUFwcChjbGllbnQsIG9wdGlvbnMpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZUh0dHAoY2xpZW50LCBvcHRpb25zKTtcbiAgICB0aGlzLmluaXRpYWxpemVIZWFkZXJzKGNsaWVudCwgb3B0aW9ucyk7XG4gICAgdGhpcy5pbml0aWFsaXplRmlsZUxvZ2dpbmcoY2xpZW50LCBvcHRpb25zKTtcblxuICAgIHRoaXMud2Fybk9uVW5yZWNvZ25pemVkT3B0aW9ucyhvcHRpb25zLCBjbGllbnQsIFJFQ09HTklaRURfT1BUSU9OUyk7XG4gIH1cblxuICAvLyBQUklWQVRFXG5cbiAgaW5pdGlhbGl6ZUNsaWVudENyZWRlbnRpYWxzKGNsaWVudCwgb3B0aW9ucykge1xuICAgIGNsaWVudC5jbGllbnRJZCA9IHRoaXMuaW5pdFJlcXVpcmVkKCdjbGllbnRJZCcsIG9wdGlvbnMpO1xuICAgIGNsaWVudC5jbGllbnRTZWNyZXQgPSB0aGlzLmluaXRSZXF1aXJlZCgnY2xpZW50U2VjcmV0Jywgb3B0aW9ucyk7XG4gIH1cblxuICBpbml0aWFsaXplTG9nZ2VyKGNsaWVudCwgb3B0aW9ucykge1xuICAgIGNsaWVudC5sb2dnZXIgPSB0aGlzLmluaXRPcHRpb25hbCgnbG9nZ2VyJywgb3B0aW9ucywgY29uc29sZSk7XG4gICAgY2xpZW50LmxvZ0xldmVsID0gdGhpcy5pbml0T3B0aW9uYWwoJ2xvZ0xldmVsJywgb3B0aW9ucywgJ3NpbGVudCcpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZUhvc3QoY2xpZW50LCBvcHRpb25zKSB7XG4gICAgbGV0IGhvc3RuYW1lID0gdGhpcy5pbml0T3B0aW9uYWwoJ2hvc3RuYW1lJywgb3B0aW9ucywgJ3Rlc3QnKTtcbiAgICBjbGllbnQuaG9zdCA9IHRoaXMuaW5pdE9wdGlvbmFsKCdob3N0Jywgb3B0aW9ucywgSE9TVFNbaG9zdG5hbWVdKTtcbiAgICBjbGllbnQucG9ydCA9IHRoaXMuaW5pdE9wdGlvbmFsKCdwb3J0Jywgb3B0aW9ucywgNDQzKTtcbiAgICBjbGllbnQuc3NsID0gdGhpcy5pbml0T3B0aW9uYWwoJ3NzbCcsIG9wdGlvbnMsIHRydWUpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZUN1c3RvbUFwcChjbGllbnQsIG9wdGlvbnMpIHtcbiAgICBjbGllbnQuY3VzdG9tQXBwSWQgPSB0aGlzLmluaXRPcHRpb25hbCgnY3VzdG9tQXBwSWQnLCBvcHRpb25zKTtcbiAgICBjbGllbnQuY3VzdG9tQXBwVmVyc2lvbiA9IHRoaXMuaW5pdE9wdGlvbmFsKCdjdXN0b21BcHBWZXJzaW9uJywgb3B0aW9ucyk7XG4gIH1cblxuICBpbml0aWFsaXplSHR0cChjbGllbnQsIG9wdGlvbnMpIHtcbiAgICBsZXQgbmV0d29yayA9IGNsaWVudC5zc2wgPyBodHRwcyA6IGh0dHA7XG4gICAgY2xpZW50Lmh0dHAgPSB0aGlzLmluaXRPcHRpb25hbCgnaHR0cCcsIG9wdGlvbnMsIG5ldHdvcmspO1xuICB9XG5cbiAgaW5pdGlhbGl6ZUhlYWRlcnMoY2xpZW50LCBvcHRpb25zKSB7XG4gICAgY2xpZW50LmN1c3RvbUhlYWRlcnMgPSB0aGlzLmluaXRPcHRpb25hbCgnaGVhZGVycycsIG9wdGlvbnMsIHt9KTtcbiAgfVxuXG4gIGluaXRpYWxpemVGaWxlTG9nZ2luZyhjbGllbnQsIG9wdGlvbnMpIHtcbiAgICBjbGllbnQuc2F2ZVRvRmlsZSA9IHRoaXMuaW5pdE9wdGlvbmFsKCdzYXZlVG9GaWxlJywgb3B0aW9ucywgZmFsc2UpO1xuICAgIGNsaWVudC5sb2dEaXJlY3RvcnkgPSB0aGlzLmluaXRPcHRpb25hbCgnbG9nRGlyZWN0b3J5Jywgb3B0aW9ucywgJ2xvZ3MnKTtcbiAgfVxuXG4gIGluaXRSZXF1aXJlZChrZXksIG9wdGlvbnMpIHtcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5pbml0T3B0aW9uYWwoa2V5LCBvcHRpb25zKTtcbiAgICBpZiAoIXJlc3VsdCkgdGhyb3cgbmV3IEFyZ3VtZW50RXJyb3IoYE1pc3NpbmcgcmVxdWlyZWQgYXJndW1lbnQ6ICR7a2V5fWApO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBpbml0T3B0aW9uYWwoa2V5LCBvcHRpb25zLCBmYWxsYmFjayA9IG51bGwpIHtcbiAgICAvL0VudiB2YXJpYWJsZXMgbmFtZXMgZXhwZWN0ZWQgdG8gYmUgaW4gU05BS0VfQ0FTRSBhbmQgdXBwZXJjYXNlXG4gICAgbGV0IGVudktleSA9IGBBTUFERVVTXyR7a2V5XG4gICAgICAucmVwbGFjZSgvW0EtWl0vZywgKGMpID0+IGBfJHtjLnRvTG93ZXJDYXNlKCl9YClcbiAgICAgIC50b1VwcGVyQ2FzZSgpfWA7XG4gICAgbGV0IHZhbHVlID0gb3B0aW9uc1trZXldIHx8IHByb2Nlc3MuZW52W2VudktleV0gfHwgZmFsbGJhY2s7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgd2Fybk9uVW5yZWNvZ25pemVkT3B0aW9ucyhvcHRpb25zLCBjbGllbnQsIHJlY29nbml6ZWRPcHRpb25zKSB7XG4gICAgT2JqZWN0LmtleXMob3B0aW9ucykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZiAocmVjb2duaXplZE9wdGlvbnMuaW5kZXhPZihrZXkpID09PSAtMSAmJiBjbGllbnQud2FybigpKSB7XG4gICAgICAgIGNsaWVudC5sb2dnZXIubG9nKGBVbnJlY29nbml6ZWQgb3B0aW9uOiAke2tleX1gKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vLyBQUklWQVRFXG5cbmNsYXNzIEFyZ3VtZW50RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB0aGlzLm5hbWUgPSAnQXJndW1lbnRFcnJvcic7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVmFsaWRhdG9yO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxLQUFBLEdBQUFGLHNCQUFBLENBQUFDLE9BQUE7QUFBd0IsU0FBQUQsdUJBQUFHLENBQUEsV0FBQUEsQ0FBQSxJQUFBQSxDQUFBLENBQUFDLFVBQUEsR0FBQUQsQ0FBQSxnQkFBQUEsQ0FBQTtBQUFBLFNBQUFF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