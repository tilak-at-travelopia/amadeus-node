"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _client = _interopRequireDefault(require("./amadeus/client"));
var _pagination = _interopRequireDefault(require("./amadeus/client/pagination"));
var _reference_data = _interopRequireDefault(require("./amadeus/namespaces/reference_data"));
var _shopping = _interopRequireDefault(require("./amadeus/namespaces/shopping"));
var _booking = _interopRequireDefault(require("./amadeus/namespaces/booking"));
var _travel = _interopRequireDefault(require("./amadeus/namespaces/travel"));
var _e_reputation = _interopRequireDefault(require("./amadeus/namespaces/e_reputation"));
var _media = _interopRequireDefault(require("./amadeus/namespaces/media"));
var _ordering = _interopRequireDefault(require("./amadeus/namespaces/ordering"));
var _airport = _interopRequireDefault(require("./amadeus/namespaces/airport"));
var _schedule = _interopRequireDefault(require("./amadeus/namespaces/schedule"));
var _analytics = _interopRequireDefault(require("./amadeus/namespaces/analytics"));
var _location = _interopRequireDefault(require("./amadeus/namespaces/location"));
var _airline = _interopRequireDefault(require("./amadeus/namespaces/airline"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * The Amadeus client library for accessing the travel APIs.
 *
 * Initialize using your credentials:
 *
 * ```js
 * var Amadeus = require('amadeus');
 * var amadeus = new Amadeus({
 *     clientId:    'YOUR_CLIENT_ID',
 *     clientSecret: 'YOUR_CLIENT_SECRET'
 * });
 * ```
 *
 * Alternatively, initialize the library using
 * the environment variables `AMADEUS_CLIENT_ID`
 * and `AMADEUS_CLIENT_SECRET`
 *
 * ```js
 * var amadeus = new Amadeus();
 * ```
 *
 * @param {Object} params
 * @param {string} params.clientId the API key used to authenticate the API
 * @param {string} params.clientSecret the API secret used to authenticate
 *  the API
 * @param {Object} [params.logger=console] a `console`-compatible logger that
 *  accepts `log`, `error` and `debug` calls.
 * @param {string} [params.logLevel='warn'] the log level for the client,
 *  available options are `debug`, `warn`, and `silent`
 * @param {string} [params.hostname='production'] the name of the server API
 *  calls are made to (`production` or `test`)
 * @param {string} [params.host] the full domain or IP for a server to make the
 *  API clal to. Only use this if you don't want to use the provided servers
 * @param {boolean} [params.ssl=true] wether to use SSL for this API call
 * @param {number} [params.port=443] the port to make the API call to
 * @param {string} [params.customAppId=null] a custom App ID to be passed in
 * the User Agent to the server.
 * @param {string} [params.customAppVersion=null] a custom App Version number to
 * be passed in the User Agent to the server.
 * @param {Object} [params.http=https] an optional Node/HTTP(S)-compatible client
 *  that accepts a 'request()' call with an array of options.
 *
 * @property {Client} client The client for making authenticated HTTP calls
 * @property {number} version The version of this API client
 */
var Amadeus = /*#__PURE__*/function () {
  function Amadeus() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, Amadeus);
    this.client = new _client["default"](params);
    this.version = this.client.version;
    this.referenceData = new _reference_data["default"](this.client);
    this.shopping = new _shopping["default"](this.client);
    this.booking = new _booking["default"](this.client);
    this.travel = new _travel["default"](this.client);
    this.eReputation = new _e_reputation["default"](this.client);
    this.media = new _media["default"](this.client);
    this.ordering = new _ordering["default"](this.client);
    this.airport = new _airport["default"](this.client);
    this.pagination = new _pagination["default"](this.client);
    this.schedule = new _schedule["default"](this.client);
    this.analytics = new _analytics["default"](this.client);
    this.location = new _location["default"](this.client);
    this.airline = new _airline["default"](this.client);
  }

  /**
   * The previous page for the given response. Resolves to null if the page
   * could not be found.
   *
   * ```js
   * amadeus.referenceData.locations.get({
   *   keyword: 'LON',
   *   subType: 'AIRPORT,CITY',
   *   page: { offset: 2 }
   * }).then(function(response){
   *   console.log(response);
   *   return amadeus.previous(response);
   * }).then(function(previousPage){
   *   console.log(previousPage);
   * });
   * ```
   *
   * @param response the previous response for an API call
   * @return {Promise.<Response,ResponseError>} a Promise
   */
  return _createClass(Amadeus, [{
    key: "previous",
    value: function previous(response) {
      return this.pagination.page('previous', response);
    }

    /**
     * The next page for the given response. Resolves to null if the page could
     * not be found.
     *
     * ```js
     * amadeus.referenceData.locations.get({
     *   keyword: 'LON',
     *   subType: 'AIRPORT,CITY'
     * }).then(function(response){
     *   console.log(response);
     *   return amadeus.next(response);
     * }).then(function(nextPage){
     *   console.log(nextPage);
     * });
     * ```
     *
     * @param response the previous response for an API call
     * @return {Promise.<Response,ResponseError>} a Promise
     */
  }, {
    key: "next",
    value: function next(response) {
      return this.pagination.page('next', response);
    }

    /**
     * The first page for the given response. Resolves to null if the page
     * could not be found.
     *
     * ```js
     * amadeus.referenceData.locations.get({
     *   keyword: 'LON',
     *   subType: 'AIRPORT,CITY',
     *   page: { offset: 2 }
     * }).then(function(response){
     *   console.log(response);
     *   return amadeus.first(response);
     * }).then(function(firstPage){
     *   console.log(firstPage);
     * });
     * ```
     *
     * @param response the previous response for an API call
     * @return {Promise.<Response,ResponseError>} a Promise
     */
  }, {
    key: "first",
    value: function first(response) {
      return this.pagination.page('first', response);
    }

    /**
     * The last page for the given response. Resolves to null if the page
     * could not be found.
     *
     * ```js
     * amadeus.referenceData.locations.get({
     *   keyword: 'LON',
     *   subType: 'AIRPORT,CITY'
     * }).then(function(response){
     *   console.log(response);
     *   return amadeus.last(response);
     * }).then(function(lastPage){
     *   console.log(lastPage);
     * });
     * ```
     *
     * @param response the previous response for an API call
     * @return {Promise.<Response,ResponseError>} a Promise
     */
  }, {
    key: "last",
    value: function last(response) {
      return this.pagination.page('last', response);
    }

    /**
     * Set custom headers that will be sent with every API request.
     * This method allows you to update headers dynamically after creating
     * the Amadeus instance. New headers will be merged with existing ones.
     *
     * ```js
     * amadeus.setCustomHeaders({
     *   'X-Custom-Header': 'new-value',
     *   'X-Request-ID': '67890'
     * });
     * ```
     *
     * @param {Object} headers - An object containing header key-value pairs
     */
  }, {
    key: "setCustomHeaders",
    value: function setCustomHeaders() {
      var headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (_typeof(headers) !== 'object' || headers === null) {
        throw new Error('Headers must be an object');
      }
      this.client.customHeaders = Object.assign(this.client.customHeaders || {}, headers);
    }

    /**
     * Get the current custom headers that are sent with API requests.
     *
     * ```js
     * const currentHeaders = amadeus.getCustomHeaders();
     * console.log(currentHeaders);
     * ```
     *
     * @return {Object} The current custom headers object
     */
  }, {
    key: "getCustomHeaders",
    value: function getCustomHeaders() {
      return this.client.customHeaders || {};
    }

    /**
     * Remove specific custom headers or clear all custom headers.
     *
     * ```js
     * // Remove specific headers
     * amadeus.removeCustomHeaders(['X-Header1', 'X-Header2']);
     * 
     * // Clear all custom headers
     * amadeus.removeCustomHeaders();
     * ```
     *
     * @param {Array<string>} [headerNames] - Array of header names to remove. If not provided, all headers are cleared.
     */
  }, {
    key: "removeCustomHeaders",
    value: function removeCustomHeaders() {
      var headerNames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (headerNames === null) {
        // Clear all headers
        this.client.customHeaders = {};
      } else if (Array.isArray(headerNames)) {
        // Remove specific headers
        var currentHeaders = this.client.customHeaders || {};
        headerNames.forEach(function (headerName) {
          delete currentHeaders[headerName];
        });
      } else {
        throw new Error('headerNames must be an array or null');
      }
    }
  }]);
}();
/**
 * A handy list of location types, to be used in the locations API:
 *
 * ```js
 * amadeus.referenceData.location.get({
 *   keyword: 'lon',
 *   subType: Amadeus.location.any
 * });
 * ```
 *
 * Currently available are the types `.airport`, `.city`, and `.any`
 */
Amadeus.location = {
  airport: 'AIRPORT',
  city: 'CITY',
  any: 'AIRPORT,CITY'
};

/**
 * A handy list of direction types, to be used in the Flight Busiest Period API:
 *
 * ```js
 * amadeus.travel.analytics.airTraffic.busiestPeriod.get({
 *   cityCode: 'par',
 *   perdiod: 2015,
 *   direction: Amadeus.direction.arriving
 * });
 * ```
 *
 * Currently available are the types `.arriving` and `.departing`
 */

Amadeus.direction = {
  arriving: 'ARRIVING',
  departing: 'DEPARTING'
};
var _default = exports["default"] = Amadeus;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfY2xpZW50IiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsInJlcXVpcmUiLCJfcGFnaW5hdGlvbiIsIl9yZWZlcmVuY2VfZGF0YSIsIl9zaG9wcGluZyIsIl9ib29raW5nIiwiX3RyYXZlbCIsIl9lX3JlcHV0YXRpb24iLCJfbWVkaWEiLCJfb3JkZXJpbmciLCJfYWlycG9ydCIsIl9zY2hlZHVsZSIsIl9hbmFseXRpY3MiLCJfbG9jYXRpb24iLCJfYWlybGluZSIsImUiLCJfX2VzTW9kdWxlIiwiX3R5cGVvZiIsIm8iLCJTeW1ib2wiLCJpdGVyYXRvciIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiX2NsYXNzQ2FsbENoZWNrIiwiYSIsIm4iLCJUeXBlRXJyb3IiLCJfZGVmaW5lUHJvcGVydGllcyIsInIiLCJ0IiwibGVuZ3RoIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJfdG9Qcm9wZXJ0eUtleSIsImtleSIsIl9jcmVhdGVDbGFzcyIsImkiLCJfdG9QcmltaXRpdmUiLCJ0b1ByaW1pdGl2ZSIsImNhbGwiLCJTdHJpbmciLCJOdW1iZXIiLCJBbWFkZXVzIiwicGFyYW1zIiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwiY2xpZW50IiwiQ2xpZW50IiwidmVyc2lvbiIsInJlZmVyZW5jZURhdGEiLCJSZWZlcmVuY2VEYXRhIiwic2hvcHBpbmciLCJTaG9wcGluZyIsImJvb2tpbmciLCJCb29raW5nIiwidHJhdmVsIiwiVHJhdmVsIiwiZVJlcHV0YXRpb24iLCJFUmVwdXRhdGlvbiIsIm1lZGlhIiwiTWVkaWEiLCJvcmRlcmluZyIsIk9yZGVyaW5nIiwiYWlycG9ydCIsIkFpcnBvcnQiLCJwYWdpbmF0aW9uIiwiUGFnaW5hdGlvbiIsInNjaGVkdWxlIiwiU2NoZWR1bGUiLCJhbmFseXRpY3MiLCJBbmFseXRpY3MiLCJsb2NhdGlvbiIsIkxvY2F0aW9uIiwiYWlybGluZSIsIkFpcmxpbmUiLCJ2YWx1ZSIsInByZXZpb3VzIiwicmVzcG9uc2UiLCJwYWdlIiwibmV4dCIsImZpcnN0IiwibGFzdCIsInNldEN1c3RvbUhlYWRlcnMiLCJoZWFkZXJzIiwiRXJyb3IiLCJjdXN0b21IZWFkZXJzIiwiYXNzaWduIiwiZ2V0Q3VzdG9tSGVhZGVycyIsInJlbW92ZUN1c3RvbUhlYWRlcnMiLCJoZWFkZXJOYW1lcyIsIkFycmF5IiwiaXNBcnJheSIsImN1cnJlbnRIZWFkZXJzIiwiZm9yRWFjaCIsImhlYWRlck5hbWUiLCJjaXR5IiwiYW55IiwiZGlyZWN0aW9uIiwiYXJyaXZpbmciLCJkZXBhcnRpbmciLCJfZGVmYXVsdCIsImV4cG9ydHMiLCJtb2R1bGUiLCJkZWZhdWx0Il0sInNvdXJjZXMiOlsiLi4vc3JjL2FtYWRldXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENsaWVudCAgICAgICAgZnJvbSAnLi9hbWFkZXVzL2NsaWVudCc7XG5pbXBvcnQgUGFnaW5hdGlvbiAgICBmcm9tICcuL2FtYWRldXMvY2xpZW50L3BhZ2luYXRpb24nO1xuXG5pbXBvcnQgUmVmZXJlbmNlRGF0YSBmcm9tICcuL2FtYWRldXMvbmFtZXNwYWNlcy9yZWZlcmVuY2VfZGF0YSc7XG5pbXBvcnQgU2hvcHBpbmcgICAgICBmcm9tICcuL2FtYWRldXMvbmFtZXNwYWNlcy9zaG9wcGluZyc7XG5pbXBvcnQgQm9va2luZyAgICAgICBmcm9tICcuL2FtYWRldXMvbmFtZXNwYWNlcy9ib29raW5nJztcbmltcG9ydCBUcmF2ZWwgICAgICAgIGZyb20gJy4vYW1hZGV1cy9uYW1lc3BhY2VzL3RyYXZlbCc7XG5pbXBvcnQgRVJlcHV0YXRpb24gICBmcm9tICcuL2FtYWRldXMvbmFtZXNwYWNlcy9lX3JlcHV0YXRpb24nO1xuaW1wb3J0IE1lZGlhICAgICAgICAgZnJvbSAnLi9hbWFkZXVzL25hbWVzcGFjZXMvbWVkaWEnO1xuaW1wb3J0IE9yZGVyaW5nICAgICAgZnJvbSAnLi9hbWFkZXVzL25hbWVzcGFjZXMvb3JkZXJpbmcnO1xuaW1wb3J0IEFpcnBvcnQgICAgICAgZnJvbSAnLi9hbWFkZXVzL25hbWVzcGFjZXMvYWlycG9ydCc7XG5pbXBvcnQgU2NoZWR1bGUgICAgICBmcm9tICcuL2FtYWRldXMvbmFtZXNwYWNlcy9zY2hlZHVsZSc7XG5pbXBvcnQgQW5hbHl0aWNzICAgICBmcm9tICcuL2FtYWRldXMvbmFtZXNwYWNlcy9hbmFseXRpY3MnO1xuaW1wb3J0IExvY2F0aW9uICAgICAgZnJvbSAnLi9hbWFkZXVzL25hbWVzcGFjZXMvbG9jYXRpb24nO1xuaW1wb3J0IEFpcmxpbmUgICAgICAgZnJvbSAnLi9hbWFkZXVzL25hbWVzcGFjZXMvYWlybGluZSc7XG5cblxuLyoqXG4gKiBUaGUgQW1hZGV1cyBjbGllbnQgbGlicmFyeSBmb3IgYWNjZXNzaW5nIHRoZSB0cmF2ZWwgQVBJcy5cbiAqXG4gKiBJbml0aWFsaXplIHVzaW5nIHlvdXIgY3JlZGVudGlhbHM6XG4gKlxuICogYGBganNcbiAqIHZhciBBbWFkZXVzID0gcmVxdWlyZSgnYW1hZGV1cycpO1xuICogdmFyIGFtYWRldXMgPSBuZXcgQW1hZGV1cyh7XG4gKiAgICAgY2xpZW50SWQ6ICAgICdZT1VSX0NMSUVOVF9JRCcsXG4gKiAgICAgY2xpZW50U2VjcmV0OiAnWU9VUl9DTElFTlRfU0VDUkVUJ1xuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBBbHRlcm5hdGl2ZWx5LCBpbml0aWFsaXplIHRoZSBsaWJyYXJ5IHVzaW5nXG4gKiB0aGUgZW52aXJvbm1lbnQgdmFyaWFibGVzIGBBTUFERVVTX0NMSUVOVF9JRGBcbiAqIGFuZCBgQU1BREVVU19DTElFTlRfU0VDUkVUYFxuICpcbiAqIGBgYGpzXG4gKiB2YXIgYW1hZGV1cyA9IG5ldyBBbWFkZXVzKCk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zLmNsaWVudElkIHRoZSBBUEkga2V5IHVzZWQgdG8gYXV0aGVudGljYXRlIHRoZSBBUElcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbXMuY2xpZW50U2VjcmV0IHRoZSBBUEkgc2VjcmV0IHVzZWQgdG8gYXV0aGVudGljYXRlXG4gKiAgdGhlIEFQSVxuICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXMubG9nZ2VyPWNvbnNvbGVdIGEgYGNvbnNvbGVgLWNvbXBhdGlibGUgbG9nZ2VyIHRoYXRcbiAqICBhY2NlcHRzIGBsb2dgLCBgZXJyb3JgIGFuZCBgZGVidWdgIGNhbGxzLlxuICogQHBhcmFtIHtzdHJpbmd9IFtwYXJhbXMubG9nTGV2ZWw9J3dhcm4nXSB0aGUgbG9nIGxldmVsIGZvciB0aGUgY2xpZW50LFxuICogIGF2YWlsYWJsZSBvcHRpb25zIGFyZSBgZGVidWdgLCBgd2FybmAsIGFuZCBgc2lsZW50YFxuICogQHBhcmFtIHtzdHJpbmd9IFtwYXJhbXMuaG9zdG5hbWU9J3Byb2R1Y3Rpb24nXSB0aGUgbmFtZSBvZiB0aGUgc2VydmVyIEFQSVxuICogIGNhbGxzIGFyZSBtYWRlIHRvIChgcHJvZHVjdGlvbmAgb3IgYHRlc3RgKVxuICogQHBhcmFtIHtzdHJpbmd9IFtwYXJhbXMuaG9zdF0gdGhlIGZ1bGwgZG9tYWluIG9yIElQIGZvciBhIHNlcnZlciB0byBtYWtlIHRoZVxuICogIEFQSSBjbGFsIHRvLiBPbmx5IHVzZSB0aGlzIGlmIHlvdSBkb24ndCB3YW50IHRvIHVzZSB0aGUgcHJvdmlkZWQgc2VydmVyc1xuICogQHBhcmFtIHtib29sZWFufSBbcGFyYW1zLnNzbD10cnVlXSB3ZXRoZXIgdG8gdXNlIFNTTCBmb3IgdGhpcyBBUEkgY2FsbFxuICogQHBhcmFtIHtudW1iZXJ9IFtwYXJhbXMucG9ydD00NDNdIHRoZSBwb3J0IHRvIG1ha2UgdGhlIEFQSSBjYWxsIHRvXG4gKiBAcGFyYW0ge3N0cmluZ30gW3BhcmFtcy5jdXN0b21BcHBJZD1udWxsXSBhIGN1c3RvbSBBcHAgSUQgdG8gYmUgcGFzc2VkIGluXG4gKiB0aGUgVXNlciBBZ2VudCB0byB0aGUgc2VydmVyLlxuICogQHBhcmFtIHtzdHJpbmd9IFtwYXJhbXMuY3VzdG9tQXBwVmVyc2lvbj1udWxsXSBhIGN1c3RvbSBBcHAgVmVyc2lvbiBudW1iZXIgdG9cbiAqIGJlIHBhc3NlZCBpbiB0aGUgVXNlciBBZ2VudCB0byB0aGUgc2VydmVyLlxuICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXMuaHR0cD1odHRwc10gYW4gb3B0aW9uYWwgTm9kZS9IVFRQKFMpLWNvbXBhdGlibGUgY2xpZW50XG4gKiAgdGhhdCBhY2NlcHRzIGEgJ3JlcXVlc3QoKScgY2FsbCB3aXRoIGFuIGFycmF5IG9mIG9wdGlvbnMuXG4gKlxuICogQHByb3BlcnR5IHtDbGllbnR9IGNsaWVudCBUaGUgY2xpZW50IGZvciBtYWtpbmcgYXV0aGVudGljYXRlZCBIVFRQIGNhbGxzXG4gKiBAcHJvcGVydHkge251bWJlcn0gdmVyc2lvbiBUaGUgdmVyc2lvbiBvZiB0aGlzIEFQSSBjbGllbnRcbiAqL1xuY2xhc3MgQW1hZGV1cyB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtcyA9IHt9KSB7XG4gICAgdGhpcy5jbGllbnQgPSBuZXcgQ2xpZW50KHBhcmFtcyk7XG4gICAgdGhpcy52ZXJzaW9uID0gdGhpcy5jbGllbnQudmVyc2lvbjtcblxuICAgIHRoaXMucmVmZXJlbmNlRGF0YSAgPSBuZXcgUmVmZXJlbmNlRGF0YSh0aGlzLmNsaWVudCk7XG4gICAgdGhpcy5zaG9wcGluZyAgICAgICA9IG5ldyBTaG9wcGluZyh0aGlzLmNsaWVudCk7XG4gICAgdGhpcy5ib29raW5nICAgICAgICA9IG5ldyBCb29raW5nKHRoaXMuY2xpZW50KTtcbiAgICB0aGlzLnRyYXZlbCAgICAgICAgID0gbmV3IFRyYXZlbCh0aGlzLmNsaWVudCk7XG4gICAgdGhpcy5lUmVwdXRhdGlvbiAgICA9IG5ldyBFUmVwdXRhdGlvbih0aGlzLmNsaWVudCk7XG4gICAgdGhpcy5tZWRpYSAgICAgICAgICA9IG5ldyBNZWRpYSh0aGlzLmNsaWVudCk7XG4gICAgdGhpcy5vcmRlcmluZyAgICAgICA9IG5ldyBPcmRlcmluZyh0aGlzLmNsaWVudCk7XG4gICAgdGhpcy5haXJwb3J0ICAgICAgICA9IG5ldyBBaXJwb3J0KHRoaXMuY2xpZW50KTtcbiAgICB0aGlzLnBhZ2luYXRpb24gICAgID0gbmV3IFBhZ2luYXRpb24odGhpcy5jbGllbnQpO1xuICAgIHRoaXMuc2NoZWR1bGUgICAgICAgPSBuZXcgU2NoZWR1bGUodGhpcy5jbGllbnQpO1xuICAgIHRoaXMuYW5hbHl0aWNzICAgICAgPSBuZXcgQW5hbHl0aWNzKHRoaXMuY2xpZW50KTtcbiAgICB0aGlzLmxvY2F0aW9uICAgICAgID0gbmV3IExvY2F0aW9uKHRoaXMuY2xpZW50KTtcbiAgICB0aGlzLmFpcmxpbmUgICAgICAgID0gbmV3IEFpcmxpbmUodGhpcy5jbGllbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBwcmV2aW91cyBwYWdlIGZvciB0aGUgZ2l2ZW4gcmVzcG9uc2UuIFJlc29sdmVzIHRvIG51bGwgaWYgdGhlIHBhZ2VcbiAgICogY291bGQgbm90IGJlIGZvdW5kLlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiBhbWFkZXVzLnJlZmVyZW5jZURhdGEubG9jYXRpb25zLmdldCh7XG4gICAqICAga2V5d29yZDogJ0xPTicsXG4gICAqICAgc3ViVHlwZTogJ0FJUlBPUlQsQ0lUWScsXG4gICAqICAgcGFnZTogeyBvZmZzZXQ6IDIgfVxuICAgKiB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICogICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAqICAgcmV0dXJuIGFtYWRldXMucHJldmlvdXMocmVzcG9uc2UpO1xuICAgKiB9KS50aGVuKGZ1bmN0aW9uKHByZXZpb3VzUGFnZSl7XG4gICAqICAgY29uc29sZS5sb2cocHJldmlvdXNQYWdlKTtcbiAgICogfSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gcmVzcG9uc2UgdGhlIHByZXZpb3VzIHJlc3BvbnNlIGZvciBhbiBBUEkgY2FsbFxuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxSZXNwb25zZSxSZXNwb25zZUVycm9yPn0gYSBQcm9taXNlXG4gICAqL1xuICBwcmV2aW91cyhyZXNwb25zZSkgeyByZXR1cm4gdGhpcy5wYWdpbmF0aW9uLnBhZ2UoJ3ByZXZpb3VzJywgcmVzcG9uc2UpOyB9XG5cbiAgLyoqXG4gICAqIFRoZSBuZXh0IHBhZ2UgZm9yIHRoZSBnaXZlbiByZXNwb25zZS4gUmVzb2x2ZXMgdG8gbnVsbCBpZiB0aGUgcGFnZSBjb3VsZFxuICAgKiBub3QgYmUgZm91bmQuXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIGFtYWRldXMucmVmZXJlbmNlRGF0YS5sb2NhdGlvbnMuZ2V0KHtcbiAgICogICBrZXl3b3JkOiAnTE9OJyxcbiAgICogICBzdWJUeXBlOiAnQUlSUE9SVCxDSVRZJ1xuICAgKiB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICogICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAqICAgcmV0dXJuIGFtYWRldXMubmV4dChyZXNwb25zZSk7XG4gICAqIH0pLnRoZW4oZnVuY3Rpb24obmV4dFBhZ2Upe1xuICAgKiAgIGNvbnNvbGUubG9nKG5leHRQYWdlKTtcbiAgICogfSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gcmVzcG9uc2UgdGhlIHByZXZpb3VzIHJlc3BvbnNlIGZvciBhbiBBUEkgY2FsbFxuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxSZXNwb25zZSxSZXNwb25zZUVycm9yPn0gYSBQcm9taXNlXG4gICAqL1xuICBuZXh0KHJlc3BvbnNlKSAgICAgeyByZXR1cm4gdGhpcy5wYWdpbmF0aW9uLnBhZ2UoJ25leHQnLCByZXNwb25zZSk7IH1cblxuICAvKipcbiAgICogVGhlIGZpcnN0IHBhZ2UgZm9yIHRoZSBnaXZlbiByZXNwb25zZS4gUmVzb2x2ZXMgdG8gbnVsbCBpZiB0aGUgcGFnZVxuICAgKiBjb3VsZCBub3QgYmUgZm91bmQuXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIGFtYWRldXMucmVmZXJlbmNlRGF0YS5sb2NhdGlvbnMuZ2V0KHtcbiAgICogICBrZXl3b3JkOiAnTE9OJyxcbiAgICogICBzdWJUeXBlOiAnQUlSUE9SVCxDSVRZJyxcbiAgICogICBwYWdlOiB7IG9mZnNldDogMiB9XG4gICAqIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgKiAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICogICByZXR1cm4gYW1hZGV1cy5maXJzdChyZXNwb25zZSk7XG4gICAqIH0pLnRoZW4oZnVuY3Rpb24oZmlyc3RQYWdlKXtcbiAgICogICBjb25zb2xlLmxvZyhmaXJzdFBhZ2UpO1xuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSByZXNwb25zZSB0aGUgcHJldmlvdXMgcmVzcG9uc2UgZm9yIGFuIEFQSSBjYWxsXG4gICAqIEByZXR1cm4ge1Byb21pc2UuPFJlc3BvbnNlLFJlc3BvbnNlRXJyb3I+fSBhIFByb21pc2VcbiAgICovXG4gIGZpcnN0KHJlc3BvbnNlKSAgICB7IHJldHVybiB0aGlzLnBhZ2luYXRpb24ucGFnZSgnZmlyc3QnLCByZXNwb25zZSk7IH1cblxuICAvKipcbiAgICogVGhlIGxhc3QgcGFnZSBmb3IgdGhlIGdpdmVuIHJlc3BvbnNlLiBSZXNvbHZlcyB0byBudWxsIGlmIHRoZSBwYWdlXG4gICAqIGNvdWxkIG5vdCBiZSBmb3VuZC5cbiAgICpcbiAgICogYGBganNcbiAgICogYW1hZGV1cy5yZWZlcmVuY2VEYXRhLmxvY2F0aW9ucy5nZXQoe1xuICAgKiAgIGtleXdvcmQ6ICdMT04nLFxuICAgKiAgIHN1YlR5cGU6ICdBSVJQT1JULENJVFknXG4gICAqIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgKiAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICogICByZXR1cm4gYW1hZGV1cy5sYXN0KHJlc3BvbnNlKTtcbiAgICogfSkudGhlbihmdW5jdGlvbihsYXN0UGFnZSl7XG4gICAqICAgY29uc29sZS5sb2cobGFzdFBhZ2UpO1xuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSByZXNwb25zZSB0aGUgcHJldmlvdXMgcmVzcG9uc2UgZm9yIGFuIEFQSSBjYWxsXG4gICAqIEByZXR1cm4ge1Byb21pc2UuPFJlc3BvbnNlLFJlc3BvbnNlRXJyb3I+fSBhIFByb21pc2VcbiAgICovXG4gIGxhc3QocmVzcG9uc2UpICAgICB7IHJldHVybiB0aGlzLnBhZ2luYXRpb24ucGFnZSgnbGFzdCcsIHJlc3BvbnNlKTsgfVxuXG4gIC8qKlxuICAgKiBTZXQgY3VzdG9tIGhlYWRlcnMgdGhhdCB3aWxsIGJlIHNlbnQgd2l0aCBldmVyeSBBUEkgcmVxdWVzdC5cbiAgICogVGhpcyBtZXRob2QgYWxsb3dzIHlvdSB0byB1cGRhdGUgaGVhZGVycyBkeW5hbWljYWxseSBhZnRlciBjcmVhdGluZ1xuICAgKiB0aGUgQW1hZGV1cyBpbnN0YW5jZS4gTmV3IGhlYWRlcnMgd2lsbCBiZSBtZXJnZWQgd2l0aCBleGlzdGluZyBvbmVzLlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiBhbWFkZXVzLnNldEN1c3RvbUhlYWRlcnMoe1xuICAgKiAgICdYLUN1c3RvbS1IZWFkZXInOiAnbmV3LXZhbHVlJyxcbiAgICogICAnWC1SZXF1ZXN0LUlEJzogJzY3ODkwJ1xuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgaGVhZGVyIGtleS12YWx1ZSBwYWlyc1xuICAgKi9cbiAgc2V0Q3VzdG9tSGVhZGVycyhoZWFkZXJzID0ge30pIHtcbiAgICBpZiAodHlwZW9mIGhlYWRlcnMgIT09ICdvYmplY3QnIHx8IGhlYWRlcnMgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSGVhZGVycyBtdXN0IGJlIGFuIG9iamVjdCcpO1xuICAgIH1cbiAgICB0aGlzLmNsaWVudC5jdXN0b21IZWFkZXJzID0gT2JqZWN0LmFzc2lnbih0aGlzLmNsaWVudC5jdXN0b21IZWFkZXJzIHx8IHt9LCBoZWFkZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgY3VzdG9tIGhlYWRlcnMgdGhhdCBhcmUgc2VudCB3aXRoIEFQSSByZXF1ZXN0cy5cbiAgICpcbiAgICogYGBganNcbiAgICogY29uc3QgY3VycmVudEhlYWRlcnMgPSBhbWFkZXVzLmdldEN1c3RvbUhlYWRlcnMoKTtcbiAgICogY29uc29sZS5sb2coY3VycmVudEhlYWRlcnMpO1xuICAgKiBgYGBcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgY3VycmVudCBjdXN0b20gaGVhZGVycyBvYmplY3RcbiAgICovXG4gIGdldEN1c3RvbUhlYWRlcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xpZW50LmN1c3RvbUhlYWRlcnMgfHwge307XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHNwZWNpZmljIGN1c3RvbSBoZWFkZXJzIG9yIGNsZWFyIGFsbCBjdXN0b20gaGVhZGVycy5cbiAgICpcbiAgICogYGBganNcbiAgICogLy8gUmVtb3ZlIHNwZWNpZmljIGhlYWRlcnNcbiAgICogYW1hZGV1cy5yZW1vdmVDdXN0b21IZWFkZXJzKFsnWC1IZWFkZXIxJywgJ1gtSGVhZGVyMiddKTtcbiAgICogXG4gICAqIC8vIENsZWFyIGFsbCBjdXN0b20gaGVhZGVyc1xuICAgKiBhbWFkZXVzLnJlbW92ZUN1c3RvbUhlYWRlcnMoKTtcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gW2hlYWRlck5hbWVzXSAtIEFycmF5IG9mIGhlYWRlciBuYW1lcyB0byByZW1vdmUuIElmIG5vdCBwcm92aWRlZCwgYWxsIGhlYWRlcnMgYXJlIGNsZWFyZWQuXG4gICAqL1xuICByZW1vdmVDdXN0b21IZWFkZXJzKGhlYWRlck5hbWVzID0gbnVsbCkge1xuICAgIGlmIChoZWFkZXJOYW1lcyA9PT0gbnVsbCkge1xuICAgICAgLy8gQ2xlYXIgYWxsIGhlYWRlcnNcbiAgICAgIHRoaXMuY2xpZW50LmN1c3RvbUhlYWRlcnMgPSB7fTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoaGVhZGVyTmFtZXMpKSB7XG4gICAgICAvLyBSZW1vdmUgc3BlY2lmaWMgaGVhZGVyc1xuICAgICAgY29uc3QgY3VycmVudEhlYWRlcnMgPSB0aGlzLmNsaWVudC5jdXN0b21IZWFkZXJzIHx8IHt9O1xuICAgICAgaGVhZGVyTmFtZXMuZm9yRWFjaChoZWFkZXJOYW1lID0+IHtcbiAgICAgICAgZGVsZXRlIGN1cnJlbnRIZWFkZXJzW2hlYWRlck5hbWVdO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaGVhZGVyTmFtZXMgbXVzdCBiZSBhbiBhcnJheSBvciBudWxsJyk7XG4gICAgfVxuICB9XG59XG5cblxuLyoqXG4gKiBBIGhhbmR5IGxpc3Qgb2YgbG9jYXRpb24gdHlwZXMsIHRvIGJlIHVzZWQgaW4gdGhlIGxvY2F0aW9ucyBBUEk6XG4gKlxuICogYGBganNcbiAqIGFtYWRldXMucmVmZXJlbmNlRGF0YS5sb2NhdGlvbi5nZXQoe1xuICogICBrZXl3b3JkOiAnbG9uJyxcbiAqICAgc3ViVHlwZTogQW1hZGV1cy5sb2NhdGlvbi5hbnlcbiAqIH0pO1xuICogYGBgXG4gKlxuICogQ3VycmVudGx5IGF2YWlsYWJsZSBhcmUgdGhlIHR5cGVzIGAuYWlycG9ydGAsIGAuY2l0eWAsIGFuZCBgLmFueWBcbiAqL1xuQW1hZGV1cy5sb2NhdGlvbiA9IHtcbiAgYWlycG9ydDogJ0FJUlBPUlQnLFxuICBjaXR5OiAnQ0lUWScsXG4gIGFueTogJ0FJUlBPUlQsQ0lUWSdcbn07XG5cbi8qKlxuICogQSBoYW5keSBsaXN0IG9mIGRpcmVjdGlvbiB0eXBlcywgdG8gYmUgdXNlZCBpbiB0aGUgRmxpZ2h0IEJ1c2llc3QgUGVyaW9kIEFQSTpcbiAqXG4gKiBgYGBqc1xuICogYW1hZGV1cy50cmF2ZWwuYW5hbHl0aWNzLmFpclRyYWZmaWMuYnVzaWVzdFBlcmlvZC5nZXQoe1xuICogICBjaXR5Q29kZTogJ3BhcicsXG4gKiAgIHBlcmRpb2Q6IDIwMTUsXG4gKiAgIGRpcmVjdGlvbjogQW1hZGV1cy5kaXJlY3Rpb24uYXJyaXZpbmdcbiAqIH0pO1xuICogYGBgXG4gKlxuICogQ3VycmVudGx5IGF2YWlsYWJsZSBhcmUgdGhlIHR5cGVzIGAuYXJyaXZpbmdgIGFuZCBgLmRlcGFydGluZ2BcbiAqL1xuXG5BbWFkZXVzLmRpcmVjdGlvbiA9IHtcbiAgYXJyaXZpbmc6ICdBUlJJVklORycsXG4gIGRlcGFydGluZzogJ0RFUEFSVElORydcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFtYWRldXM7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLE9BQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLFdBQUEsR0FBQUYsc0JBQUEsQ0FBQUMsT0FBQTtBQUVBLElBQUFFLGVBQUEsR0FBQUgsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFHLFNBQUEsR0FBQUosc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFJLFFBQUEsR0FBQUwsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFLLE9BQUEsR0FBQU4sc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFNLGFBQUEsR0FBQVAsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFPLE1BQUEsR0FBQVIsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFRLFNBQUEsR0FBQVQsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFTLFFBQUEsR0FBQVYsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFVLFNBQUEsR0FBQVgsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFXLFVBQUEsR0FBQVosc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFZLFNBQUEsR0FBQWIsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFhLFFBQUEsR0FBQWQsc0JBQUEsQ0FBQUMsT0FBQTtBQUF5RCxTQUFBRCx1QkFBQWUsQ0FBQSxXQUFBQSxDQUFBLElBQUFBLENBQUEsQ0FBQUMs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