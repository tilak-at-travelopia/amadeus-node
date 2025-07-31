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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfY2xpZW50IiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsInJlcXVpcmUiLCJfcGFnaW5hdGlvbiIsIl9yZWZlcmVuY2VfZGF0YSIsIl9zaG9wcGluZyIsIl9ib29raW5nIiwiX3RyYXZlbCIsIl9lX3JlcHV0YXRpb24iLCJfbWVkaWEiLCJfb3JkZXJpbmciLCJfYWlycG9ydCIsIl9zY2hlZHVsZSIsIl9hbmFseXRpY3MiLCJfbG9jYXRpb24iLCJfYWlybGluZSIsImUiLCJfX2VzTW9kdWxlIiwiX3R5cGVvZiIsIm8iLCJTeW1ib2wiLCJpdGVyYXRvciIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiX2NsYXNzQ2FsbENoZWNrIiwiYSIsIm4iLCJUeXBlRXJyb3IiLCJfZGVmaW5lUHJvcGVydGllcyIsInIiLCJ0IiwibGVuZ3RoIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJfdG9Qcm9wZXJ0eUtleSIsImtleSIsIl9jcmVhdGVDbGFzcyIsImkiLCJfdG9QcmltaXRpdmUiLCJ0b1ByaW1pdGl2ZSIsImNhbGwiLCJTdHJpbmciLCJOdW1iZXIiLCJBbWFkZXVzIiwicGFyYW1zIiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwiY2xpZW50IiwiQ2xpZW50IiwidmVyc2lvbiIsInJlZmVyZW5jZURhdGEiLCJSZWZlcmVuY2VEYXRhIiwic2hvcHBpbmciLCJTaG9wcGluZyIsImJvb2tpbmciLCJCb29raW5nIiwidHJhdmVsIiwiVHJhdmVsIiwiZVJlcHV0YXRpb24iLCJFUmVwdXRhdGlvbiIsIm1lZGlhIiwiTWVkaWEiLCJvcmRlcmluZyIsIk9yZGVyaW5nIiwiYWlycG9ydCIsIkFpcnBvcnQiLCJwYWdpbmF0aW9uIiwiUGFnaW5hdGlvbiIsInNjaGVkdWxlIiwiU2NoZWR1bGUiLCJhbmFseXRpY3MiLCJBbmFseXRpY3MiLCJsb2NhdGlvbiIsIkxvY2F0aW9uIiwiYWlybGluZSIsIkFpcmxpbmUiLCJ2YWx1ZSIsInByZXZpb3VzIiwicmVzcG9uc2UiLCJwYWdlIiwibmV4dCIsImZpcnN0IiwibGFzdCIsInNldEN1c3RvbUhlYWRlcnMiLCJoZWFkZXJzIiwiRXJyb3IiLCJjdXN0b21IZWFkZXJzIiwiYXNzaWduIiwiZ2V0Q3VzdG9tSGVhZGVycyIsInJlbW92ZUN1c3RvbUhlYWRlcnMiLCJoZWFkZXJOYW1lcyIsIkFycmF5IiwiaXNBcnJheSIsImN1cnJlbnRIZWFkZXJzIiwiZm9yRWFjaCIsImhlYWRlck5hbWUiLCJjaXR5IiwiYW55IiwiZGlyZWN0aW9uIiwiYXJyaXZpbmciLCJkZXBhcnRpbmciLCJfZGVmYXVsdCIsImV4cG9ydHMiLCJtb2R1bGUiLCJkZWZhdWx0Il0sInNvdXJjZXMiOlsiLi4vc3JjL2FtYWRldXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENsaWVudCAgICAgICAgZnJvbSAnLi9hbWFkZXVzL2NsaWVudCc7XG5pbXBvcnQgUGFnaW5hdGlvbiAgICBmcm9tICcuL2FtYWRldXMvY2xpZW50L3BhZ2luYXRpb24nO1xuXG5pbXBvcnQgUmVmZXJlbmNlRGF0YSBmcm9tICcuL2FtYWRldXMvbmFtZXNwYWNlcy9yZWZlcmVuY2VfZGF0YSc7XG5pbXBvcnQgU2hvcHBpbmcgICAgICBmcm9tICcuL2FtYWRldXMvbmFtZXNwYWNlcy9zaG9wcGluZyc7XG5pbXBvcnQgQm9va2luZyAgICAgICBmcm9tICcuL2FtYWRldXMvbmFtZXNwYWNlcy9ib29raW5nJztcbmltcG9ydCBUcmF2ZWwgICAgICAgIGZyb20gJy4vYW1hZGV1cy9uYW1lc3BhY2VzL3RyYXZlbCc7XG5pbXBvcnQgRVJlcHV0YXRpb24gICBmcm9tICcuL2FtYWRldXMvbmFtZXNwYWNlcy9lX3JlcHV0YXRpb24nO1xuaW1wb3J0IE1lZGlhICAgICAgICAgZnJvbSAnLi9hbWFkZXVzL25hbWVzcGFjZXMvbWVkaWEnO1xuaW1wb3J0IE9yZGVyaW5nICAgICAgZnJvbSAnLi9hbWFkZXVzL25hbWVzcGFjZXMvb3JkZXJpbmcnO1xuaW1wb3J0IEFpcnBvcnQgICAgICAgZnJvbSAnLi9hbWFkZXVzL25hbWVzcGFjZXMvYWlycG9ydCc7XG5pbXBvcnQgU2NoZWR1bGUgICAgICBmcm9tICcuL2FtYWRldXMvbmFtZXNwYWNlcy9zY2hlZHVsZSc7XG5pbXBvcnQgQW5hbHl0aWNzICAgICBmcm9tICcuL2FtYWRldXMvbmFtZXNwYWNlcy9hbmFseXRpY3MnO1xuaW1wb3J0IExvY2F0aW9uICAgICAgZnJvbSAnLi9hbWFkZXVzL25hbWVzcGFjZXMvbG9jYXRpb24nO1xuaW1wb3J0IEFpcmxpbmUgICAgICAgZnJvbSAnLi9hbWFkZXVzL25hbWVzcGFjZXMvYWlybGluZSc7XG5cblxuLyoqXG4gKiBUaGUgQW1hZGV1cyBjbGllbnQgbGlicmFyeSBmb3IgYWNjZXNzaW5nIHRoZSB0cmF2ZWwgQVBJcy5cbiAqXG4gKiBJbml0aWFsaXplIHVzaW5nIHlvdXIgY3JlZGVudGlhbHM6XG4gKlxuICogYGBganNcbiAqIHZhciBBbWFkZXVzID0gcmVxdWlyZSgnYW1hZGV1cycpO1xuICogdmFyIGFtYWRldXMgPSBuZXcgQW1hZGV1cyh7XG4gKiAgICAgY2xpZW50SWQ6ICAgICdZT1VSX0NMSUVOVF9JRCcsXG4gKiAgICAgY2xpZW50U2VjcmV0OiAnWU9VUl9DTElFTlRfU0VDUkVUJ1xuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBBbHRlcm5hdGl2ZWx5LCBpbml0aWFsaXplIHRoZSBsaWJyYXJ5IHVzaW5nXG4gKiB0aGUgZW52aXJvbm1lbnQgdmFyaWFibGVzIGBBTUFERVVTX0NMSUVOVF9JRGBcbiAqIGFuZCBgQU1BREVVU19DTElFTlRfU0VDUkVUYFxuICpcbiAqIGBgYGpzXG4gKiB2YXIgYW1hZGV1cyA9IG5ldyBBbWFkZXVzKCk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zLmNsaWVudElkIHRoZSBBUEkga2V5IHVzZWQgdG8gYXV0aGVudGljYXRlIHRoZSBBUElcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbXMuY2xpZW50U2VjcmV0IHRoZSBBUEkgc2VjcmV0IHVzZWQgdG8gYXV0aGVudGljYXRlXG4gKiAgdGhlIEFQSVxuICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXMubG9nZ2VyPWNvbnNvbGVdIGEgYGNvbnNvbGVgLWNvbXBhdGlibGUgbG9nZ2VyIHRoYXRcbiAqICBhY2NlcHRzIGBsb2dgLCBgZXJyb3JgIGFuZCBgZGVidWdgIGNhbGxzLlxuICogQHBhcmFtIHtzdHJpbmd9IFtwYXJhbXMubG9nTGV2ZWw9J3dhcm4nXSB0aGUgbG9nIGxldmVsIGZvciB0aGUgY2xpZW50LFxuICogIGF2YWlsYWJsZSBvcHRpb25zIGFyZSBgZGVidWdgLCBgd2FybmAsIGFuZCBgc2lsZW50YFxuICogQHBhcmFtIHtzdHJpbmd9IFtwYXJhbXMuaG9zdG5hbWU9J3Byb2R1Y3Rpb24nXSB0aGUgbmFtZSBvZiB0aGUgc2VydmVyIEFQSVxuICogIGNhbGxzIGFyZSBtYWRlIHRvIChgcHJvZHVjdGlvbmAgb3IgYHRlc3RgKVxuICogQHBhcmFtIHtzdHJpbmd9IFtwYXJhbXMuaG9zdF0gdGhlIGZ1bGwgZG9tYWluIG9yIElQIGZvciBhIHNlcnZlciB0byBtYWtlIHRoZVxuICogIEFQSSBjbGFsIHRvLiBPbmx5IHVzZSB0aGlzIGlmIHlvdSBkb24ndCB3YW50IHRvIHVzZSB0aGUgcHJvdmlkZWQgc2VydmVyc1xuICogQHBhcmFtIHtib29sZWFufSBbcGFyYW1zLnNzbD10cnVlXSB3ZXRoZXIgdG8gdXNlIFNTTCBmb3IgdGhpcyBBUEkgY2FsbFxuICogQHBhcmFtIHtudW1iZXJ9IFtwYXJhbXMucG9ydD00NDNdIHRoZSBwb3J0IHRvIG1ha2UgdGhlIEFQSSBjYWxsIHRvXG4gKiBAcGFyYW0ge3N0cmluZ30gW3BhcmFtcy5jdXN0b21BcHBJZD1udWxsXSBhIGN1c3RvbSBBcHAgSUQgdG8gYmUgcGFzc2VkIGluXG4gKiB0aGUgVXNlciBBZ2VudCB0byB0aGUgc2VydmVyLlxuICogQHBhcmFtIHtzdHJpbmd9IFtwYXJhbXMuY3VzdG9tQXBwVmVyc2lvbj1udWxsXSBhIGN1c3RvbSBBcHAgVmVyc2lvbiBudW1iZXIgdG9cbiAqIGJlIHBhc3NlZCBpbiB0aGUgVXNlciBBZ2VudCB0byB0aGUgc2VydmVyLlxuICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXMuaHR0cD1odHRwc10gYW4gb3B0aW9uYWwgTm9kZS9IVFRQKFMpLWNvbXBhdGlibGUgY2xpZW50XG4gKiAgdGhhdCBhY2NlcHRzIGEgJ3JlcXVlc3QoKScgY2FsbCB3aXRoIGFuIGFycmF5IG9mIG9wdGlvbnMuXG4gKlxuICogQHByb3BlcnR5IHtDbGllbnR9IGNsaWVudCBUaGUgY2xpZW50IGZvciBtYWtpbmcgYXV0aGVudGljYXRlZCBIVFRQIGNhbGxzXG4gKiBAcHJvcGVydHkge251bWJlcn0gdmVyc2lvbiBUaGUgdmVyc2lvbiBvZiB0aGlzIEFQSSBjbGllbnRcbiAqL1xuY2xhc3MgQW1hZGV1cyB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtcyA9IHt9KSB7XG4gICAgdGhpcy5jbGllbnQgPSBuZXcgQ2xpZW50KHBhcmFtcyk7XG4gICAgdGhpcy52ZXJzaW9uID0gdGhpcy5jbGllbnQudmVyc2lvbjtcblxuICAgIHRoaXMucmVmZXJlbmNlRGF0YSAgPSBuZXcgUmVmZXJlbmNlRGF0YSh0aGlzLmNsaWVudCk7XG4gICAgdGhpcy5zaG9wcGluZyAgICAgICA9IG5ldyBTaG9wcGluZyh0aGlzLmNsaWVudCk7XG4gICAgdGhpcy5ib29raW5nICAgICAgICA9IG5ldyBCb29raW5nKHRoaXMuY2xpZW50KTtcbiAgICB0aGlzLnRyYXZlbCAgICAgICAgID0gbmV3IFRyYXZlbCh0aGlzLmNsaWVudCk7XG4gICAgdGhpcy5lUmVwdXRhdGlvbiAgICA9IG5ldyBFUmVwdXRhdGlvbih0aGlzLmNsaWVudCk7XG4gICAgdGhpcy5tZWRpYSAgICAgICAgICA9IG5ldyBNZWRpYSh0aGlzLmNsaWVudCk7XG4gICAgdGhpcy5vcmRlcmluZyAgICAgICA9IG5ldyBPcmRlcmluZyh0aGlzLmNsaWVudCk7XG4gICAgdGhpcy5haXJwb3J0ICAgICAgICA9IG5ldyBBaXJwb3J0KHRoaXMuY2xpZW50KTtcbiAgICB0aGlzLnBhZ2luYXRpb24gICAgID0gbmV3IFBhZ2luYXRpb24odGhpcy5jbGllbnQpO1xuICAgIHRoaXMuc2NoZWR1bGUgICAgICAgPSBuZXcgU2NoZWR1bGUodGhpcy5jbGllbnQpO1xuICAgIHRoaXMuYW5hbHl0aWNzICAgICAgPSBuZXcgQW5hbHl0aWNzKHRoaXMuY2xpZW50KTtcbiAgICB0aGlzLmxvY2F0aW9uICAgICAgID0gbmV3IExvY2F0aW9uKHRoaXMuY2xpZW50KTtcbiAgICB0aGlzLmFpcmxpbmUgICAgICAgID0gbmV3IEFpcmxpbmUodGhpcy5jbGllbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBwcmV2aW91cyBwYWdlIGZvciB0aGUgZ2l2ZW4gcmVzcG9uc2UuIFJlc29sdmVzIHRvIG51bGwgaWYgdGhlIHBhZ2VcbiAgICogY291bGQgbm90IGJlIGZvdW5kLlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiBhbWFkZXVzLnJlZmVyZW5jZURhdGEubG9jYXRpb25zLmdldCh7XG4gICAqICAga2V5d29yZDogJ0xPTicsXG4gICAqICAgc3ViVHlwZTogJ0FJUlBPUlQsQ0lUWScsXG4gICAqICAgcGFnZTogeyBvZmZzZXQ6IDIgfVxuICAgKiB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICogICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAqICAgcmV0dXJuIGFtYWRldXMucHJldmlvdXMocmVzcG9uc2UpO1xuICAgKiB9KS50aGVuKGZ1bmN0aW9uKHByZXZpb3VzUGFnZSl7XG4gICAqICAgY29uc29sZS5sb2cocHJldmlvdXNQYWdlKTtcbiAgICogfSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gcmVzcG9uc2UgdGhlIHByZXZpb3VzIHJlc3BvbnNlIGZvciBhbiBBUEkgY2FsbFxuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxSZXNwb25zZSxSZXNwb25zZUVycm9yPn0gYSBQcm9taXNlXG4gICAqL1xuICBwcmV2aW91cyhyZXNwb25zZSkgeyByZXR1cm4gdGhpcy5wYWdpbmF0aW9uLnBhZ2UoJ3ByZXZpb3VzJywgcmVzcG9uc2UpOyB9XG5cbiAgLyoqXG4gICAqIFRoZSBuZXh0IHBhZ2UgZm9yIHRoZSBnaXZlbiByZXNwb25zZS4gUmVzb2x2ZXMgdG8gbnVsbCBpZiB0aGUgcGFnZSBjb3VsZFxuICAgKiBub3QgYmUgZm91bmQuXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIGFtYWRldXMucmVmZXJlbmNlRGF0YS5sb2NhdGlvbnMuZ2V0KHtcbiAgICogICBrZXl3b3JkOiAnTE9OJyxcbiAgICogICBzdWJUeXBlOiAnQUlSUE9SVCxDSVRZJ1xuICAgKiB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICogICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAqICAgcmV0dXJuIGFtYWRldXMubmV4dChyZXNwb25zZSk7XG4gICAqIH0pLnRoZW4oZnVuY3Rpb24obmV4dFBhZ2Upe1xuICAgKiAgIGNvbnNvbGUubG9nKG5leHRQYWdlKTtcbiAgICogfSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gcmVzcG9uc2UgdGhlIHByZXZpb3VzIHJlc3BvbnNlIGZvciBhbiBBUEkgY2FsbFxuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxSZXNwb25zZSxSZXNwb25zZUVycm9yPn0gYSBQcm9taXNlXG4gICAqL1xuICBuZXh0KHJlc3BvbnNlKSAgICAgeyByZXR1cm4gdGhpcy5wYWdpbmF0aW9uLnBhZ2UoJ25leHQnLCByZXNwb25zZSk7IH1cblxuICAvKipcbiAgICogVGhlIGZpcnN0IHBhZ2UgZm9yIHRoZSBnaXZlbiByZXNwb25zZS4gUmVzb2x2ZXMgdG8gbnVsbCBpZiB0aGUgcGFnZVxuICAgKiBjb3VsZCBub3QgYmUgZm91bmQuXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIGFtYWRldXMucmVmZXJlbmNlRGF0YS5sb2NhdGlvbnMuZ2V0KHtcbiAgICogICBrZXl3b3JkOiAnTE9OJyxcbiAgICogICBzdWJUeXBlOiAnQUlSUE9SVCxDSVRZJyxcbiAgICogICBwYWdlOiB7IG9mZnNldDogMiB9XG4gICAqIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgKiAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICogICByZXR1cm4gYW1hZGV1cy5maXJzdChyZXNwb25zZSk7XG4gICAqIH0pLnRoZW4oZnVuY3Rpb24oZmlyc3RQYWdlKXtcbiAgICogICBjb25zb2xlLmxvZyhmaXJzdFBhZ2UpO1xuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSByZXNwb25zZSB0aGUgcHJldmlvdXMgcmVzcG9uc2UgZm9yIGFuIEFQSSBjYWxsXG4gICAqIEByZXR1cm4ge1Byb21pc2UuPFJlc3BvbnNlLFJlc3BvbnNlRXJyb3I+fSBhIFByb21pc2VcbiAgICovXG4gIGZpcnN0KHJlc3BvbnNlKSAgICB7IHJldHVybiB0aGlzLnBhZ2luYXRpb24ucGFnZSgnZmlyc3QnLCByZXNwb25zZSk7IH1cblxuICAvKipcbiAgICogVGhlIGxhc3QgcGFnZSBmb3IgdGhlIGdpdmVuIHJlc3BvbnNlLiBSZXNvbHZlcyB0byBudWxsIGlmIHRoZSBwYWdlXG4gICAqIGNvdWxkIG5vdCBiZSBmb3VuZC5cbiAgICpcbiAgICogYGBganNcbiAgICogYW1hZGV1cy5yZWZlcmVuY2VEYXRhLmxvY2F0aW9ucy5nZXQoe1xuICAgKiAgIGtleXdvcmQ6ICdMT04nLFxuICAgKiAgIHN1YlR5cGU6ICdBSVJQT1JULENJVFknXG4gICAqIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgKiAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICogICByZXR1cm4gYW1hZGV1cy5sYXN0KHJlc3BvbnNlKTtcbiAgICogfSkudGhlbihmdW5jdGlvbihsYXN0UGFnZSl7XG4gICAqICAgY29uc29sZS5sb2cobGFzdFBhZ2UpO1xuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSByZXNwb25zZSB0aGUgcHJldmlvdXMgcmVzcG9uc2UgZm9yIGFuIEFQSSBjYWxsXG4gICAqIEByZXR1cm4ge1Byb21pc2UuPFJlc3BvbnNlLFJlc3BvbnNlRXJyb3I+fSBhIFByb21pc2VcbiAgICovXG4gIGxhc3QocmVzcG9uc2UpICAgICB7IHJldHVybiB0aGlzLnBhZ2luYXRpb24ucGFnZSgnbGFzdCcsIHJlc3BvbnNlKTsgfVxuXG4gIC8qKlxuICAgKiBTZXQgY3VzdG9tIGhlYWRlcnMgdGhhdCB3aWxsIGJlIHNlbnQgd2l0aCBldmVyeSBBUEkgcmVxdWVzdC5cbiAgICogVGhpcyBtZXRob2QgYWxsb3dzIHlvdSB0byB1cGRhdGUgaGVhZGVycyBkeW5hbWljYWxseSBhZnRlciBjcmVhdGluZ1xuICAgKiB0aGUgQW1hZGV1cyBpbnN0YW5jZS4gTmV3IGhlYWRlcnMgd2lsbCBiZSBtZXJnZWQgd2l0aCBleGlzdGluZyBvbmVzLlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiBhbWFkZXVzLnNldEN1c3RvbUhlYWRlcnMoe1xuICAgKiAgICdYLUN1c3RvbS1IZWFkZXInOiAnbmV3LXZhbHVlJyxcbiAgICogICAnWC1SZXF1ZXN0LUlEJzogJzY3ODkwJ1xuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgaGVhZGVyIGtleS12YWx1ZSBwYWlyc1xuICAgKi9cbiAgc2V0Q3VzdG9tSGVhZGVycyhoZWFkZXJzID0ge30pIHtcbiAgICBpZiAodHlwZW9mIGhlYWRlcnMgIT09ICdvYmplY3QnIHx8IGhlYWRlcnMgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSGVhZGVycyBtdXN0IGJlIGFuIG9iamVjdCcpO1xuICAgIH1cbiAgICB0aGlzLmNsaWVudC5jdXN0b21IZWFkZXJzID0gT2JqZWN0LmFzc2lnbih0aGlzLmNsaWVudC5jdXN0b21IZWFkZXJzIHx8IHt9LCBoZWFkZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgY3VzdG9tIGhlYWRlcnMgdGhhdCBhcmUgc2VudCB3aXRoIEFQSSByZXF1ZXN0cy5cbiAgICpcbiAgICogYGBganNcbiAgICogY29uc3QgY3VycmVudEhlYWRlcnMgPSBhbWFkZXVzLmdldEN1c3RvbUhlYWRlcnMoKTtcbiAgICogY29uc29sZS5sb2coY3VycmVudEhlYWRlcnMpO1xuICAgKiBgYGBcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgY3VycmVudCBjdXN0b20gaGVhZGVycyBvYmplY3RcbiAgICovXG4gIGdldEN1c3RvbUhlYWRlcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xpZW50LmN1c3RvbUhlYWRlcnMgfHwge307XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHNwZWNpZmljIGN1c3RvbSBoZWFkZXJzIG9yIGNsZWFyIGFsbCBjdXN0b20gaGVhZGVycy5cbiAgICpcbiAgICogYGBganNcbiAgICogLy8gUmVtb3ZlIHNwZWNpZmljIGhlYWRlcnNcbiAgICogYW1hZGV1cy5yZW1vdmVDdXN0b21IZWFkZXJzKFsnWC1IZWFkZXIxJywgJ1gtSGVhZGVyMiddKTtcbiAgICpcbiAgICogLy8gQ2xlYXIgYWxsIGN1c3RvbSBoZWFkZXJzXG4gICAqIGFtYWRldXMucmVtb3ZlQ3VzdG9tSGVhZGVycygpO1xuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSBbaGVhZGVyTmFtZXNdIC0gQXJyYXkgb2YgaGVhZGVyIG5hbWVzIHRvIHJlbW92ZS4gSWYgbm90IHByb3ZpZGVkLCBhbGwgaGVhZGVycyBhcmUgY2xlYXJlZC5cbiAgICovXG4gIHJlbW92ZUN1c3RvbUhlYWRlcnMoaGVhZGVyTmFtZXMgPSBudWxsKSB7XG4gICAgaWYgKGhlYWRlck5hbWVzID09PSBudWxsKSB7XG4gICAgICAvLyBDbGVhciBhbGwgaGVhZGVyc1xuICAgICAgdGhpcy5jbGllbnQuY3VzdG9tSGVhZGVycyA9IHt9O1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShoZWFkZXJOYW1lcykpIHtcbiAgICAgIC8vIFJlbW92ZSBzcGVjaWZpYyBoZWFkZXJzXG4gICAgICBjb25zdCBjdXJyZW50SGVhZGVycyA9IHRoaXMuY2xpZW50LmN1c3RvbUhlYWRlcnMgfHwge307XG4gICAgICBoZWFkZXJOYW1lcy5mb3JFYWNoKGhlYWRlck5hbWUgPT4ge1xuICAgICAgICBkZWxldGUgY3VycmVudEhlYWRlcnNbaGVhZGVyTmFtZV07XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdoZWFkZXJOYW1lcyBtdXN0IGJlIGFuIGFycmF5IG9yIG51bGwnKTtcbiAgICB9XG4gIH1cbn1cblxuXG4vKipcbiAqIEEgaGFuZHkgbGlzdCBvZiBsb2NhdGlvbiB0eXBlcywgdG8gYmUgdXNlZCBpbiB0aGUgbG9jYXRpb25zIEFQSTpcbiAqXG4gKiBgYGBqc1xuICogYW1hZGV1cy5yZWZlcmVuY2VEYXRhLmxvY2F0aW9uLmdldCh7XG4gKiAgIGtleXdvcmQ6ICdsb24nLFxuICogICBzdWJUeXBlOiBBbWFkZXVzLmxvY2F0aW9uLmFueVxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBDdXJyZW50bHkgYXZhaWxhYmxlIGFyZSB0aGUgdHlwZXMgYC5haXJwb3J0YCwgYC5jaXR5YCwgYW5kIGAuYW55YFxuICovXG5BbWFkZXVzLmxvY2F0aW9uID0ge1xuICBhaXJwb3J0OiAnQUlSUE9SVCcsXG4gIGNpdHk6ICdDSVRZJyxcbiAgYW55OiAnQUlSUE9SVCxDSVRZJ1xufTtcblxuLyoqXG4gKiBBIGhhbmR5IGxpc3Qgb2YgZGlyZWN0aW9uIHR5cGVzLCB0byBiZSB1c2VkIGluIHRoZSBGbGlnaHQgQnVzaWVzdCBQZXJpb2QgQVBJOlxuICpcbiAqIGBgYGpzXG4gKiBhbWFkZXVzLnRyYXZlbC5hbmFseXRpY3MuYWlyVHJhZmZpYy5idXNpZXN0UGVyaW9kLmdldCh7XG4gKiAgIGNpdHlDb2RlOiAncGFyJyxcbiAqICAgcGVyZGlvZDogMjAxNSxcbiAqICAgZGlyZWN0aW9uOiBBbWFkZXVzLmRpcmVjdGlvbi5hcnJpdmluZ1xuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBDdXJyZW50bHkgYXZhaWxhYmxlIGFyZSB0aGUgdHlwZXMgYC5hcnJpdmluZ2AgYW5kIGAuZGVwYXJ0aW5nYFxuICovXG5cbkFtYWRldXMuZGlyZWN0aW9uID0ge1xuICBhcnJpdmluZzogJ0FSUklWSU5HJyxcbiAgZGVwYXJ0aW5nOiAnREVQQVJUSU5HJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQW1hZGV1cztcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsT0FBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsV0FBQSxHQUFBRixzQkFBQSxDQUFBQyxPQUFBO0FBRUEsSUFBQUUsZUFBQSxHQUFBSCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUcsU0FBQSxHQUFBSixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUksUUFBQSxHQUFBTCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUssT0FBQSxHQUFBTixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQU0sYUFBQSxHQUFBUCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQU8sTUFBQSxHQUFBUixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQVEsU0FBQSxHQUFBVCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQVMsUUFBQSxHQUFBVixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQVUsU0FBQSxHQUFBWCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQVcsVUFBQSxHQUFBWixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQVksU0FBQSxHQUFBYixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQWEsUUFBQSxHQUFBZCxzQkFBQSxDQUFBQyxPQUFBO0FBQXlELFNBQUFELHVCQUFBZSxDQUFBLFdBQUFBLENBQUEsSUFBQUEsQ0FBQSxDQUFBQyxV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