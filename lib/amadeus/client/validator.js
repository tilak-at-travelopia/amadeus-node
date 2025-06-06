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
  'test': 'test.api.amadeus.com',
  'production': 'api.amadeus.com'
};
var RECOGNIZED_OPTIONS = ['clientId', 'clientSecret', 'logger', 'logLevel', 'hostname', 'host', 'customAppId', 'customAppVersion', 'http', 'ssl', 'port', 'headers'];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfaHR0cHMiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9odHRwIiwiZSIsIl9fZXNNb2R1bGUiLCJfY2FsbFN1cGVyIiwidCIsIm8iLCJfZ2V0UHJvdG90eXBlT2YiLCJfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybiIsIl9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QiLCJSZWZsZWN0IiwiY29uc3RydWN0IiwiY29uc3RydWN0b3IiLCJhcHBseSIsIl90eXBlb2YiLCJUeXBlRXJyb3IiLCJfYXNzZXJ0VGhpc0luaXRpYWxpemVkIiwiUmVmZXJlbmNlRXJyb3IiLCJfaW5oZXJpdHMiLCJwcm90b3R5cGUiLCJPYmplY3QiLCJjcmVhdGUiLCJ2YWx1ZSIsIndyaXRhYmxlIiwiY29uZmlndXJhYmxlIiwiZGVmaW5lUHJvcGVydHkiLCJfc2V0UHJvdG90eXBlT2YiLCJfd3JhcE5hdGl2ZVN1cGVyIiwiciIsIk1hcCIsIl9pc05hdGl2ZUZ1bmN0aW9uIiwiaGFzIiwiZ2V0Iiwic2V0IiwiV3JhcHBlciIsIl9jb25zdHJ1Y3QiLCJhcmd1bWVudHMiLCJlbnVtZXJhYmxlIiwicHVzaCIsInAiLCJiaW5kIiwiQm9vbGVhbiIsInZhbHVlT2YiLCJjYWxsIiwiRnVuY3Rpb24iLCJ0b1N0cmluZyIsImluZGV4T2YiLCJuIiwic2V0UHJvdG90eXBlT2YiLCJfX3Byb3RvX18iLCJnZXRQcm90b3R5cGVPZiIsIlN5bWJvbCIsIml0ZXJhdG9yIiwiX2NsYXNzQ2FsbENoZWNrIiwiYSIsIl9kZWZpbmVQcm9wZXJ0aWVzIiwibGVuZ3RoIiwiX3RvUHJvcGVydHlLZXkiLCJrZXkiLCJfY3JlYXRlQ2xhc3MiLCJpIiwiX3RvUHJpbWl0aXZlIiwidG9QcmltaXRpdmUiLCJTdHJpbmciLCJOdW1iZXIiLCJIT1NUUyIsIlJFQ09HTklaRURfT1BUSU9OUyIsIlZhbGlkYXRvciIsInZhbGlkYXRlQW5kSW5pdGlhbGl6ZSIsImNsaWVudCIsIm9wdGlvbnMiLCJpbml0aWFsaXplQ2xpZW50Q3JlZGVudGlhbHMiLCJpbml0aWFsaXplTG9nZ2VyIiwiaW5pdGlhbGl6ZUhvc3QiLCJpbml0aWFsaXplQ3VzdG9tQXBwIiwiaW5pdGlhbGl6ZUh0dHAiLCJpbml0aWFsaXplSGVhZGVycyIsIndhcm5PblVucmVjb2duaXplZE9wdGlvbnMiLCJjbGllbnRJZCIsImluaXRSZXF1aXJlZCIsImNsaWVudFNlY3JldCIsImxvZ2dlciIsImluaXRPcHRpb25hbCIsImNvbnNvbGUiLCJsb2dMZXZlbCIsImhvc3RuYW1lIiwiaG9zdCIsInBvcnQiLCJzc2wiLCJjdXN0b21BcHBJZCIsImN1c3RvbUFwcFZlcnNpb24iLCJuZXR3b3JrIiwiaHR0cHMiLCJodHRwIiwiY3VzdG9tSGVhZGVycyIsInJlc3VsdCIsIkFyZ3VtZW50RXJyb3IiLCJjb25jYXQiLCJmYWxsYmFjayIsInVuZGVmaW5lZCIsImVudktleSIsInJlcGxhY2UiLCJjIiwidG9Mb3dlckNhc2UiLCJ0b1VwcGVyQ2FzZSIsInByb2Nlc3MiLCJlbnYiLCJyZWNvZ25pemVkT3B0aW9ucyIsImtleXMiLCJmb3JFYWNoIiwid2FybiIsImxvZyIsIl9FcnJvciIsIm1lc3NhZ2UiLCJfdGhpcyIsIm5hbWUiLCJFcnJvciIsIl9kZWZhdWx0IiwiZXhwb3J0cyIsIm1vZHVsZSIsImRlZmF1bHQiXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYW1hZGV1cy9jbGllbnQvdmFsaWRhdG9yLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBodHRwcyAgICAgZnJvbSAnaHR0cHMnO1xuaW1wb3J0IGh0dHAgICAgICBmcm9tICdodHRwJztcblxuY29uc3QgSE9TVFMgPSB7XG4gICd0ZXN0JyAgICAgICA6ICd0ZXN0LmFwaS5hbWFkZXVzLmNvbScsXG4gICdwcm9kdWN0aW9uJyA6ICdhcGkuYW1hZGV1cy5jb20nXG59O1xuXG5jb25zdCBSRUNPR05JWkVEX09QVElPTlMgPSBbXG4gICdjbGllbnRJZCcsXG4gICdjbGllbnRTZWNyZXQnLFxuICAnbG9nZ2VyJyxcbiAgJ2xvZ0xldmVsJyxcbiAgJ2hvc3RuYW1lJyxcbiAgJ2hvc3QnLFxuICAnY3VzdG9tQXBwSWQnLFxuICAnY3VzdG9tQXBwVmVyc2lvbicsXG4gICdodHRwJyxcbiAgJ3NzbCcsXG4gICdwb3J0JyxcbiAgJ2hlYWRlcnMnXG5dO1xuXG4vKipcbiAqIEhlbHBlciBjbGFzcyBmb3IgdmFsaWRhdGluZyBwYXJhbWV0ZXJzXG4gKiBAcHJvdGVjdGVkXG4gKi9cbmNsYXNzIFZhbGlkYXRvciB7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpc2UgdGhlIGNsaWVudCdzIGRlZmF1bHQgdmFsdWUsIGVuc3VyaW5nIHRoZSByZXF1aXJlZCB2YWx1ZXMgYXJlXG4gICAqIHByZXNlbnRcbiAgICpcbiAgICogQHBhcmFtICB7Q2xpZW50fSBjbGllbnQgdGhlIGNsaWVudCBvYmplY3QgdG8gc2V0IHRoZSBkZWZhdWx0cyBmb3JcbiAgICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zIHRoZSBhc3NvY2lhdGl2ZSBhcnJheSBvZiBvcHRpb25zIHBhc3NlZCB0byB0aGVcbiAgICogIGNsaWVudCBvbiBpbml0aWFsaXphdGlvblxuICAgKi9cbiAgdmFsaWRhdGVBbmRJbml0aWFsaXplKGNsaWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuaW5pdGlhbGl6ZUNsaWVudENyZWRlbnRpYWxzKGNsaWVudCwgb3B0aW9ucyk7XG4gICAgdGhpcy5pbml0aWFsaXplTG9nZ2VyKGNsaWVudCwgb3B0aW9ucyk7XG4gICAgdGhpcy5pbml0aWFsaXplSG9zdChjbGllbnQsIG9wdGlvbnMpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZUN1c3RvbUFwcChjbGllbnQsIG9wdGlvbnMpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZUh0dHAoY2xpZW50LCBvcHRpb25zKTtcbiAgICB0aGlzLmluaXRpYWxpemVIZWFkZXJzKGNsaWVudCwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLndhcm5PblVucmVjb2duaXplZE9wdGlvbnMob3B0aW9ucywgY2xpZW50LCBSRUNPR05JWkVEX09QVElPTlMpO1xuICB9XG5cbiAgLy8gUFJJVkFURVxuXG4gIGluaXRpYWxpemVDbGllbnRDcmVkZW50aWFscyhjbGllbnQsIG9wdGlvbnMpIHtcbiAgICBjbGllbnQuY2xpZW50SWQgPSB0aGlzLmluaXRSZXF1aXJlZCgnY2xpZW50SWQnLCBvcHRpb25zKTtcbiAgICBjbGllbnQuY2xpZW50U2VjcmV0ID0gdGhpcy5pbml0UmVxdWlyZWQoJ2NsaWVudFNlY3JldCcsIG9wdGlvbnMpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZUxvZ2dlcihjbGllbnQsIG9wdGlvbnMpIHtcbiAgICBjbGllbnQubG9nZ2VyICAgID0gdGhpcy5pbml0T3B0aW9uYWwoJ2xvZ2dlcicsIG9wdGlvbnMsIGNvbnNvbGUpO1xuICAgIGNsaWVudC5sb2dMZXZlbCA9IHRoaXMuaW5pdE9wdGlvbmFsKCdsb2dMZXZlbCcsIG9wdGlvbnMsICdzaWxlbnQnKTtcbiAgfVxuXG4gIGluaXRpYWxpemVIb3N0KGNsaWVudCwgb3B0aW9ucykge1xuICAgIGxldCBob3N0bmFtZSA9IHRoaXMuaW5pdE9wdGlvbmFsKCdob3N0bmFtZScsIG9wdGlvbnMsICd0ZXN0Jyk7XG4gICAgY2xpZW50Lmhvc3QgID0gdGhpcy5pbml0T3B0aW9uYWwoJ2hvc3QnLCBvcHRpb25zLCBIT1NUU1tob3N0bmFtZV0pO1xuICAgIGNsaWVudC5wb3J0ICA9IHRoaXMuaW5pdE9wdGlvbmFsKCdwb3J0Jywgb3B0aW9ucywgNDQzKTtcbiAgICBjbGllbnQuc3NsICAgPSB0aGlzLmluaXRPcHRpb25hbCgnc3NsJywgb3B0aW9ucywgdHJ1ZSk7XG4gIH1cblxuICBpbml0aWFsaXplQ3VzdG9tQXBwKGNsaWVudCwgb3B0aW9ucykge1xuICAgIGNsaWVudC5jdXN0b21BcHBJZCA9IHRoaXMuaW5pdE9wdGlvbmFsKCdjdXN0b21BcHBJZCcsIG9wdGlvbnMpO1xuICAgIGNsaWVudC5jdXN0b21BcHBWZXJzaW9uID0gdGhpcy5pbml0T3B0aW9uYWwoJ2N1c3RvbUFwcFZlcnNpb24nLCBvcHRpb25zKTtcbiAgfVxuXG4gIGluaXRpYWxpemVIdHRwKGNsaWVudCwgb3B0aW9ucykge1xuICAgIGxldCBuZXR3b3JrID0gY2xpZW50LnNzbCA/IGh0dHBzIDogaHR0cDtcbiAgICBjbGllbnQuaHR0cCA9IHRoaXMuaW5pdE9wdGlvbmFsKCdodHRwJywgb3B0aW9ucywgbmV0d29yayk7XG4gIH1cblxuICBpbml0aWFsaXplSGVhZGVycyhjbGllbnQsIG9wdGlvbnMpIHtcbiAgICBjbGllbnQuY3VzdG9tSGVhZGVycyA9IHRoaXMuaW5pdE9wdGlvbmFsKCdoZWFkZXJzJywgb3B0aW9ucywge30pO1xuICB9XG5cbiAgaW5pdFJlcXVpcmVkKGtleSwgb3B0aW9ucykge1xuICAgIGxldCByZXN1bHQgPSB0aGlzLmluaXRPcHRpb25hbChrZXksIG9wdGlvbnMpO1xuICAgIGlmICghcmVzdWx0KSB0aHJvdyBuZXcgQXJndW1lbnRFcnJvcihgTWlzc2luZyByZXF1aXJlZCBhcmd1bWVudDogJHtrZXl9YCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGluaXRPcHRpb25hbChrZXksIG9wdGlvbnMsIGZhbGxiYWNrID0gbnVsbCkge1xuICAgIC8vRW52IHZhcmlhYmxlcyBuYW1lcyBleHBlY3RlZCB0byBiZSBpbiBTTkFLRV9DQVNFIGFuZCB1cHBlcmNhc2VcbiAgICBsZXQgZW52S2V5ID0gYEFNQURFVVNfJHtrZXkucmVwbGFjZSgvW0EtWl0vZywgYyA9PiBgXyR7Yy50b0xvd2VyQ2FzZSgpfWApLnRvVXBwZXJDYXNlKCl9YDtcbiAgICBsZXQgdmFsdWUgPSBvcHRpb25zW2tleV0gfHwgcHJvY2Vzcy5lbnZbZW52S2V5XSB8fCBmYWxsYmFjaztcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICB3YXJuT25VbnJlY29nbml6ZWRPcHRpb25zKG9wdGlvbnMsIGNsaWVudCwgcmVjb2duaXplZE9wdGlvbnMpIHtcbiAgICBPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmIChyZWNvZ25pemVkT3B0aW9ucy5pbmRleE9mKGtleSkgPT09IC0xICYmIGNsaWVudC53YXJuKCkpIHtcbiAgICAgICAgY2xpZW50LmxvZ2dlci5sb2coYFVucmVjb2duaXplZCBvcHRpb246ICR7a2V5fWApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8vIFBSSVZBVEVcblxuY2xhc3MgQXJndW1lbnRFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMubmFtZSA9ICdBcmd1bWVudEVycm9yJztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBWYWxpZGF0b3I7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLEtBQUEsR0FBQUYsc0JBQUEsQ0FBQUMsT0FBQTtBQUE2QixTQUFBRCx1QkFBQUcsQ0FBQSxXQUFBQSxDQUFBLElBQUFBLENBQUEsQ0FBQUMsVUFBQSxHQUFBRCxDQUFBLGdCQUFBQSxDQUFBO0FBQUEsU0FBQUUsV0FBQUMsQ0FBQSxFQUFBQyxDQUFBLEVBQUFKLENBQUEsV0FBQUksQ0FBQSxHQUFBQyxlQUFBLENBQUFELENBQUEsR0FBQUUsMEJBQUEsQ0FBQUgsQ0FBQSxFQUFBSSx5QkFBQSxLQUFBQyxPQUFBLENBQUFDLFNBQUEsQ0FBQUwsQ0FBQSxFQUFBSixDQUFBLFFBQUFLLGVBQUEsQ0FBQUYsQ0FBQSxFQUFBTyxXQUFBLElBQUFOLENBQUEsQ0FBQU8sS0FBQSxDQUFBUixDQUFBLEVBQUFILENBQUE7QUFBQSxTQUFBTSwyQkFBQUgsQ0FBQSxFQUFBSCxDQUFBLFFBQUFBLENBQUEsaUJBQUFZLE9BQUEsQ0FBQVosQ0FBQSwwQkFBQUEsQ0FBQSxVQUFBQSxDQUFBLGlCQUFBQSxDQUFBLFlBQUFhLFNBQUEscUVBQUFDLHNCQUFBLENB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