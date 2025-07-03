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
class FlightOrders {
  constructor(client) {
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
  post(params = {}) {
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
  patch(params = {}) {
    return this.client.patch('/v1/booking/flight-orders', params);
  }
}

export default FlightOrders;