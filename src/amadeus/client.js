import EventEmitter from 'events';
import util         from 'util';

import AccessToken from './client/access_token';
import Listener    from './client/listener';
import Request     from './client/request';
import Validator   from './client/validator';

import pkg         from '../../package.json';

/**
 * A convenient wrapper around the API, allowing for generic, authenticated and
 * unauthenticated API calls without having to manage the serialization,
 * desrialization, and authentication.
 *
 * Generally you do not need to use this object directly. Instead it is used
 * indirectly by the various namespaced methods for every API call.
 *
 * For example, the following are the semantically the same.
 *
 * ```js
 * amadeus.client.get('/v1/reference-data/urls/checkin-links', params);
 * amadeus.amadeus.reference_data.urls.checkin_links.get(params);
 * ```
 *
 * @param {Object} options a list of options. See {@link Amadeus} .
 * @property {string} clientId the API key used to authenticate the API
 * @property {string} clientSecret the API secret used to authenticate
 *  the API
 * @property {Object} logger the `console`-compatible logger used to debug calls
 * @property {string} logLevel the log level for the client, available options
 *  are `debug`, `warn`, and `silent`. Defaults to 'silent'
 * @property {string} host the hostname of the server API calls are made to
 * @property {number} port the port the server API calls are made to
 * @property {boolean} ssl wether an SSL request is made to the server
 * @property {string} customAppId the custom App ID to be passed in the User
 *  Agent to the server
 * @property {string} customAppVersion the custom App Version number to be
 *  passed in the User Agent to the server
 * @property {Object} http the Node/HTTP(S)-compatible client used to make
 *  requests
 * @property {number} version The version of this API client
 */
class Client {
  constructor(options = {}) {
    new Validator().validateAndInitialize(this, options);
    this.accessToken = new AccessToken(this);
    this.version = pkg.version;
  }

  /**
   * Make an authenticated GET API call.
   *
   * ```js
   * amadeus.client.get('/v2/foo/bar', { some: 'data' });
   * ```
   * @param {string} path the full path of the API endpoint
   * @param {Object} [params={}] the query string parameters
   * @return {Promise.<Response,ResponseError>} a Promise
   */
  get(path, params = {}) {
    return this.request('GET', path, params);
  }

  /**
   * Make an authenticated POST API call.
   *
   * ```js
   * amadeus.client.post('/v2/foo/bar', { some: 'data' });
   * ```
   * @param {string} path the full path of the API endpoint
   * @param {Object} [params={}] the POST parameters
   * @return {Promise.<Response,ResponseError>} a Promise
   */
  post(path, params = {}) {
    const stringifiedParams = typeof params === 'string' ? params : JSON.stringify(params);
    return this.request('POST', path, stringifiedParams);
  }

  /**
   * Make an authenticated DELETE API call.
   *
   * ```js
   * amadeus.client.delete('/v2/foo/bar', { some: 'data' });
   * ```
   * @param {string} path the full path of the API endpoint
   * @param {Object} [params={}] the query string parameters
   * @return {Promise.<Response,ResponseError>} a Promise
   */
  delete(path, params = {}) {
    return this.request('DELETE', path, params);
  }

  // PROTECTED

  /**
   * Make an authenticated API call.
   *
   * ```js
   * amadeus.client.call('GET', '/v2/foo/bar', { some: 'data' });
   * ```
   * @param {string} verb the HTTP method, for example `GET` or `POST`
   * @param {string} path the full path of the API endpoint
   * @param {Object} [params={}] the POST parameters
   * @return {Promise.<Response,ResponseError>} a Promise
   * @protected
   */
  request(verb, path, params = {}) {
    return this.accessToken.bearerToken(this).then((bearerToken) => {
      return this.unauthenticatedRequest(verb, path, params, bearerToken);
    });
  }

  // PRIVATE

  /**
   * Make any kind of API call, authenticated or not
   *
   * Used by the .get, .post methods to make API calls.
   *
   * Sets up a new Promise and then excutes the API call, triggering the Promise
   * to be called when the API call fails or succeeds.
   *
   * @param {string} verb the HTTP method, for example `GET` or `POST`
   * @param {string} path the full path of the API endpoint
   * @param {Object} params the parameters to pass in the query or body
   * @param {string} [bearerToken=null] the BearerToken as generated by the
   *  AccessToken class
   * @return {Promise.<Response,ResponseError>} a Promise
   * @private
   */
  unauthenticatedRequest(verb, path, params, bearerToken = null) {
    let request = this.buildRequest(verb, path, params, bearerToken);
    let emitter = new EventEmitter();
    let promise = this.buildPromise(emitter);

    this.execute(request, emitter);
    return promise;
  }

  /**
   * Actually executes the API call.
   *
   * @param {Request} request the request to execute
   * @param {EventEmitter} emitter the event emitter to notify of changes
   * @private
   */
  execute(request, emitter) {
    let http_request = this.http.request(request.options());
    let listener = new Listener(request, emitter, this);
    http_request.on('response', listener.onResponse.bind(listener));
    http_request.on('error',    listener.onError.bind(listener));
    http_request.write(request.body());
    http_request.end();
  }

  /**
   * Builds a Request object to be used in the API call
   *
   * @param {string} verb the HTTP method, for example `GET` or `POST`
   * @param {string} path the full path of the API endpoint
   * @param {Object} params the parameters to pass in the query or body
   * @param {string} [bearerToken=null] the BearerToken as generated by the
   *  AccessToken class
   * @return {Request}
   * @private
   */
  buildRequest(verb, path, params, bearerToken) {
    return new Request({
      host: this.host,
      verb: verb,
      path: path,
      params: params,
      bearerToken: bearerToken,
      clientVersion: this.version,
      languageVersion: process.versions.node,
      appId: this.customAppId,
      appVersion: this.customAppVersion,
      port: this.port,
      ssl: this.ssl,
      customHeaders: this.customHeaders
    });
  }

  /**
   * Builds a Promise to be returned to the API user
   *
   * @param  {type} emitter the event emitter to notify of changes
   * @return {Promise} a promise
   * @private
   */
  buildPromise(emitter) {
    return new Promise((resolve, reject) => {
      emitter.on('resolve', response => resolve(response));
      emitter.on('reject', error => reject(error));
    });
  }


  /**
   * Logs the request, when in debug mode
   *
   * @param  {Request} request the request object to log
   * @private
   */
  log(request) {
    /* istanbul ignore next */
    if(this.debug()) { this.logger.log(util.inspect(request, false, null)); }
  }

  /**
   * Determines if this client is in debug mode
   *
   * @return {boolean}
   */
  debug() {
    return this.logLevel == 'debug';
  }

  /**
   * Determines if this client is in warn or debug mode
   *
   * @return {boolean}
   */
  warn() {
    return this.logLevel == 'warn' || this.debug();
  }
}

export default Client;
