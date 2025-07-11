import Client        from './amadeus/client';
import Pagination    from './amadeus/client/pagination';

import ReferenceData from './amadeus/namespaces/reference_data';
import Shopping      from './amadeus/namespaces/shopping';
import Booking       from './amadeus/namespaces/booking';
import Travel        from './amadeus/namespaces/travel';
import EReputation   from './amadeus/namespaces/e_reputation';
import Media         from './amadeus/namespaces/media';
import Ordering      from './amadeus/namespaces/ordering';
import Airport       from './amadeus/namespaces/airport';
import Schedule      from './amadeus/namespaces/schedule';
import Analytics     from './amadeus/namespaces/analytics';
import Location      from './amadeus/namespaces/location';
import Airline       from './amadeus/namespaces/airline';


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
class Amadeus {
  constructor(params = {}) {
    this.client = new Client(params);
    this.version = this.client.version;

    this.referenceData  = new ReferenceData(this.client);
    this.shopping       = new Shopping(this.client);
    this.booking        = new Booking(this.client);
    this.travel         = new Travel(this.client);
    this.eReputation    = new EReputation(this.client);
    this.media          = new Media(this.client);
    this.ordering       = new Ordering(this.client);
    this.airport        = new Airport(this.client);
    this.pagination     = new Pagination(this.client);
    this.schedule       = new Schedule(this.client);
    this.analytics      = new Analytics(this.client);
    this.location       = new Location(this.client);
    this.airline        = new Airline(this.client);
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
  previous(response) { return this.pagination.page('previous', response); }

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
  next(response)     { return this.pagination.page('next', response); }

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
  first(response)    { return this.pagination.page('first', response); }

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
  last(response)     { return this.pagination.page('last', response); }

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
  setCustomHeaders(headers = {}) {
    if (typeof headers !== 'object' || headers === null) {
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
  getCustomHeaders() {
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
  removeCustomHeaders(headerNames = null) {
    if (headerNames === null) {
      // Clear all headers
      this.client.customHeaders = {};
    } else if (Array.isArray(headerNames)) {
      // Remove specific headers
      const currentHeaders = this.client.customHeaders || {};
      headerNames.forEach(headerName => {
        delete currentHeaders[headerName];
      });
    } else {
      throw new Error('headerNames must be an array or null');
    }
  }
}


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

export default Amadeus;
