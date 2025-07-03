"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * A namespaced client for the
 * `/v1/booking/flight-orders` endpoints
 *
 * Access via the {@link Amadeus} object
 *
 * ```js
 * let amadeus = new Amadeus();
 * amadeus.booking.flightOrders;
 * ```
 *
 * @param {Client} client
 */
var FlightOrders = /*#__PURE__*/function () {
  function FlightOrders(client) {
    _classCallCheck(this, FlightOrders);
    this.client = client;
  }

  /**
   * To book the selected flight-offer and create a flight-order
   *
   * @param {Object} params
   * @return {Promise.<Response,ResponseError>} a Promise
   *
   * To book the flight-offer(s) suggested by flightOffersSearch and create a flight-order
   *
   * ```js
   * amadeus.booking.flightOrders.post({
   *  'type': 'flight-order',
   *  'flightOffers': [],
   *  'travelers': []
   * });
   * ```
   */
  return _createClass(FlightOrders, [{
    key: "post",
    value: function post() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return this.client.post('/v1/booking/flight-orders', params);
    }

    /**
     * To book the selected flight-offer and create a flight-order
     *
     * @param {Object} params
     * @return {Promise.<Response,ResponseError>} a Promise
     *
     * To update the flight-order to add seats, travelers, or other information
     *
     * ```js
     * amadeus.booking.flightOrders.patch({
     *  'type': 'flight-order',
     *  'flightOffers': [
     *    {
     *      'type': 'flight-offer',
     *      'id': '1'
     *      'travelerPricings': [
     *        {
     *          'travelerId': '1',
     *          'fareDetailsBySegment': [
     *              {
     *                'segmentId': '20',
     *                'additionalServices': {
     *                  'chargeableSeatNumber': '28A'
     *                }
     *              },
     *              {
     *                'segmentId': '30',
     *                'additionalServices': {
     *                  'chargeableSeatNumber': '12C'
     *                }
     *              }
     *            ]
     *          }
     *        }
     *      ]
     *    }
     *  ]
     * });
     * ```
     */
  }, {
    key: "patch",
    value: function patch() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return this.client.patch('/v1/booking/flight-orders', params);
    }
  }]);
}();
var _default = exports["default"] = FlightOrders;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJGbGlnaHRPcmRlcnMiLCJjbGllbnQiLCJfY2xhc3NDYWxsQ2hlY2siLCJfY3JlYXRlQ2xhc3MiLCJrZXkiLCJ2YWx1ZSIsInBvc3QiLCJwYXJhbXMiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJwYXRjaCIsIl9kZWZhdWx0IiwiZXhwb3J0cyIsIm1vZHVsZSIsImRlZmF1bHQiXSwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYW1hZGV1cy9uYW1lc3BhY2VzL2Jvb2tpbmcvZmxpZ2h0X29yZGVycy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEEgbmFtZXNwYWNlZCBjbGllbnQgZm9yIHRoZVxuICogYC92MS9ib29raW5nL2ZsaWdodC1vcmRlcnNgIGVuZHBvaW50c1xuICpcbiAqIEFjY2VzcyB2aWEgdGhlIHtAbGluayBBbWFkZXVzfSBvYmplY3RcbiAqXG4gKiBgYGBqc1xuICogbGV0IGFtYWRldXMgPSBuZXcgQW1hZGV1cygpO1xuICogYW1hZGV1cy5ib29raW5nLmZsaWdodE9yZGVycztcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnRcbiAqL1xuY2xhc3MgRmxpZ2h0T3JkZXJzIHtcbiAgY29uc3RydWN0b3IoY2xpZW50KSB7XG4gICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG4gIH1cblxuICAvKipcbiAgICogVG8gYm9vayB0aGUgc2VsZWN0ZWQgZmxpZ2h0LW9mZmVyIGFuZCBjcmVhdGUgYSBmbGlnaHQtb3JkZXJcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlLjxSZXNwb25zZSxSZXNwb25zZUVycm9yPn0gYSBQcm9taXNlXG4gICAqXG4gICAqIFRvIGJvb2sgdGhlIGZsaWdodC1vZmZlcihzKSBzdWdnZXN0ZWQgYnkgZmxpZ2h0T2ZmZXJzU2VhcmNoIGFuZCBjcmVhdGUgYSBmbGlnaHQtb3JkZXJcbiAgICpcbiAgICogYGBganNcbiAgICogYW1hZGV1cy5ib29raW5nLmZsaWdodE9yZGVycy5wb3N0KHtcbiAgICogICd0eXBlJzogJ2ZsaWdodC1vcmRlcicsXG4gICAqICAnZmxpZ2h0T2ZmZXJzJzogW10sXG4gICAqICAndHJhdmVsZXJzJzogW11cbiAgICogfSk7XG4gICAqIGBgYFxuICAgKi9cbiAgcG9zdChwYXJhbXMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmNsaWVudC5wb3N0KCcvdjEvYm9va2luZy9mbGlnaHQtb3JkZXJzJywgcGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUbyBib29rIHRoZSBzZWxlY3RlZCBmbGlnaHQtb2ZmZXIgYW5kIGNyZWF0ZSBhIGZsaWdodC1vcmRlclxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gICAqIEByZXR1cm4ge1Byb21pc2UuPFJlc3BvbnNlLFJlc3BvbnNlRXJyb3I+fSBhIFByb21pc2VcbiAgICpcbiAgICogVG8gdXBkYXRlIHRoZSBmbGlnaHQtb3JkZXIgdG8gYWRkIHNlYXRzLCB0cmF2ZWxlcnMsIG9yIG90aGVyIGluZm9ybWF0aW9uXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIGFtYWRldXMuYm9va2luZy5mbGlnaHRPcmRlcnMucGF0Y2goe1xuICAgKiAgJ3R5cGUnOiAnZmxpZ2h0LW9yZGVyJyxcbiAgICogICdmbGlnaHRPZmZlcnMnOiBbXG4gICAqICAgIHtcbiAgICogICAgICAndHlwZSc6ICdmbGlnaHQtb2ZmZXInLFxuICAgKiAgICAgICdpZCc6ICcxJ1xuICAgKiAgICAgICd0cmF2ZWxlclByaWNpbmdzJzogW1xuICAgKiAgICAgICAge1xuICAgKiAgICAgICAgICAndHJhdmVsZXJJZCc6ICcxJyxcbiAgICogICAgICAgICAgJ2ZhcmVEZXRhaWxzQnlTZWdtZW50JzogW1xuICAgKiAgICAgICAgICAgICAge1xuICAgKiAgICAgICAgICAgICAgICAnc2VnbWVudElkJzogJzIwJyxcbiAgICogICAgICAgICAgICAgICAgJ2FkZGl0aW9uYWxTZXJ2aWNlcyc6IHtcbiAgICogICAgICAgICAgICAgICAgICAnY2hhcmdlYWJsZVNlYXROdW1iZXInOiAnMjhBJ1xuICAgKiAgICAgICAgICAgICAgICB9XG4gICAqICAgICAgICAgICAgICB9LFxuICAgKiAgICAgICAgICAgICAge1xuICAgKiAgICAgICAgICAgICAgICAnc2VnbWVudElkJzogJzMwJyxcbiAgICogICAgICAgICAgICAgICAgJ2FkZGl0aW9uYWxTZXJ2aWNlcyc6IHtcbiAgICogICAgICAgICAgICAgICAgICAnY2hhcmdlYWJsZVNlYXROdW1iZXInOiAnMTJDJ1xuICAgKiAgICAgICAgICAgICAgICB9XG4gICAqICAgICAgICAgICAgICB9XG4gICAqICAgICAgICAgICAgXVxuICAgKiAgICAgICAgICB9XG4gICAqICAgICAgICB9XG4gICAqICAgICAgXVxuICAgKiAgICB9XG4gICAqICBdXG4gICAqIH0pO1xuICAgKiBgYGBcbiAgICovXG4gIHBhdGNoKHBhcmFtcyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuY2xpZW50LnBhdGNoKCcvdjEvYm9va2luZy9mbGlnaHQtb3JkZXJzJywgcGFyYW1zKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBGbGlnaHRPcmRlcnM7Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVpBLElBYU1BLFlBQVk7RUFDaEIsU0FBQUEsYUFBWUMsTUFBTSxFQUFFO0lBQUFDLGVBQUEsT0FBQUYsWUFBQTtJQUNsQixJQUFJLENBQUNDLE1BQU0sR0FBR0EsTUFBTTtFQUN0Qjs7RUFFQTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQWZFLE9BQUFFLFlBQUEsQ0FBQUgsWUFBQTtJQUFBSSxHQUFBO0lBQUFDLEtBQUEsRUFnQkEsU0FBQUMsSUFBSUEsQ0FBQSxFQUFjO01BQUEsSUFBYkMsTUFBTSxHQUFBQyxTQUFBLENBQUFDLE1BQUEsUUFBQUQsU0FBQSxRQUFBRSxTQUFBLEdBQUFGLFNBQUEsTUFBRyxDQUFDLENBQUM7TUFDZCxPQUFPLElBQUksQ0FBQ1AsTUFBTSxDQUFDSyxJQUFJLENBQUMsMkJBQTJCLEVBQUVDLE1BQU0sQ0FBQztJQUM5RDs7SUFFQTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQXZDRTtJQUFBSCxHQUFBO0lBQUFDLEtBQUEsRUF3Q0EsU0FBQU0sS0FBS0EsQ0FBQSxFQUFjO01BQUEsSUFBYkosTUFBTSxHQUFBQyxTQUFBLENBQUFDLE1BQUEsUUFBQUQsU0FBQSxRQUFBRSxTQUFBLEdBQUFGLFNBQUEsTUFBRyxDQUFDLENBQUM7TUFDZixPQUFPLElBQUksQ0FBQ1AsTUFBTSxDQUFDVSxLQUFLLENBQUMsMkJBQTJCLEVBQUVKLE1BQU0sQ0FBQztJQUMvRDtFQUFDO0FBQUE7QUFBQSxJQUFBSyxRQUFBLEdBQUFDLE9BQUEsY0FHWWIsWUFBWTtBQUFBYyxNQUFBLENBQUFELE9BQUEsR0FBQUEsT0FBQSxDQUFBRSxPQUFBIiwiaWdub3JlTGlzdCI6W119