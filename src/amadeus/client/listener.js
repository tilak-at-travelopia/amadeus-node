import Response from './response';
import fs from 'fs';
import path from 'path';

import {
  ServerError,
  NotFoundError,
  ClientError,
  ParserError,
  UnknownError,
  NetworkError,
  AuthenticationError,
} from './errors';

/**
 * Listen to changes in the HTTP request and build Response/ResponseError
 * objects accordingly.
 *
 * @param {Request} request the request object used to make the call
 * @param {EventEmitter} emitter a Node event emitter
 * @param {Client} client the client instance to log results to
 * @protected
 */
class Listener {
  constructor(request, emitter, client) {
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
  onResponse(http_response) {
    let response = new Response(http_response, this.request);

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

  onError(http_response) {
    let response = new Response(http_response, this.request);
    this.onNetworkError(response)();
  }

  // PRIVATE

  /**
   * When the connection ends, check if the response can be parsed or not and
   * act accordingly.
   *
   * @param  {Response} response
   */
  onEnd(response) {
    return () => {
      response.parse();
      // Save request to file before processing response
      this.saveRequestToFile(this.request);

      if (response.success()) {
        this.onSuccess(response);
      } else {
        this.onFail(response);
      }
    };
  }

  /**
   * When the response was successful, resolve the promise and return the
   * response object
   *
   * @param  {Response} response
   */
  onSuccess(response) {
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
  onFail(response) {
    let Error = this.errorFor(response);
    let error = new Error(response);
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
  errorFor({ statusCode, parsed }) {
    let error = null;
    if (statusCode >= 500) {
      error = ServerError;
    } else if (statusCode === 401) {
      error = AuthenticationError;
    } else if (statusCode === 404) {
      error = NotFoundError;
    } else if (statusCode >= 400) {
      error = ClientError;
    } else if (!parsed) {
      error = ParserError;
    } else {
      error = UnknownError;
    }
    return error;
  }

  /**
   * When the connection ran into a network error, reject the promise with a
   * NetworkError.
   *
   * @param  {Response} response
   */
  onNetworkError(response) {
    return () => {
      response.parse();
      let error = new NetworkError(response);
      this.log(response, error);
      this.saveResponseToFile(response, error);
      this.emitter.emit('reject', error);
    };
  }

  /**
   * Logs the response, when in debug mode
   *
   * @param  {Response} response the response object to log
   * @private
   */
  log(response, error) {
    if (this.client.debug()) {
      /* istanbul ignore next */
      this.client.logger.log('Response:');
      this.client.logger.log(`Status: ${response.statusCode}`);

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
  saveRequestToFile(request) {
    if (this.client.saveToFile) {
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const sanitizedPath = request.path
          .replace(/\//g, '_')
          .replace(/[?&=]/g, '-');
        const filename = `request_${request.verb}_${sanitizedPath}_${timestamp}.json`;
        const logDir = this.client.logDirectory || 'logs';

        // Create logs directory if it doesn't exist
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }

        const filePath = path.join(logDir, filename);

        const requestData = {
          timestamp: new Date().toISOString(),
          method: request.verb,
          path: request.path,
          headers: request.options().headers,
          body: request.body(),
          params: request.params,
        };

        fs.writeFileSync(filePath, JSON.stringify(requestData, null, 2));

        if (this.client.debug()) {
          this.client.logger.log(`Request saved to ${filePath}`);
        }
      } catch (err) {
        if (this.client.warn()) {
          this.client.logger.log(
            `Failed to save request to file: ${err.message}`
          );
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
  saveResponseToFile(response, error = null) {
    if (this.client.saveToFile) {
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const sanitizedPath = response.request.path
          .replace(/\//g, '_')
          .replace(/[?&=]/g, '-');
        const filename = `response_${response.request.verb}_${sanitizedPath}_${timestamp}.json`;
        const logDir = this.client.logDirectory || 'logs';

        // Create logs directory if it doesn't exist
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }

        const filePath = path.join(logDir, filename);

        const responseData = {
          timestamp: new Date().toISOString(),
          statusCode: response.statusCode,
          headers: response.headers,
          body: response.body,
          parsed: response.parsed,
          result: response.result,
          error: error
            ? {
                code: error.code,
                description: error.description,
              }
            : null,
        };

        fs.writeFileSync(filePath, JSON.stringify(responseData, null, 2));

        if (this.client.debug()) {
          this.client.logger.log(`Response saved to ${filePath}`);
        }
      } catch (err) {
        if (this.client.warn()) {
          this.client.logger.log(
            `Failed to save response to file: ${err.message}`
          );
        }
      }
    }
  }
}

export default Listener;
