import Amadeus    from '../src/amadeus';
import Client     from '../src/amadeus/client';
import Pagination from '../src/amadeus/client/pagination';

let amadeus;
let credentials = {
  clientId: '123',
  clientSecret: '234'
};

describe('Amadeus', () => {
  it('should export an Amadeus object', () => {
    expect(Amadeus).not.toBe(null);
  });

  describe('.instance', () => {
    beforeEach(() => {
      amadeus = new Amadeus(credentials);
    });

    it('should initialize an Amadeus instance', () => {
      expect(amadeus).toBeInstanceOf(Amadeus);
    });

    it('should throw an error', () => {
      expect(() => { new Amadeus(); }).toThrowError();
    });

    it('should allow custom headers to be passed through to client', () => {
      let customHeaders = { 'X-Custom-Header': 'test-value', 'X-Request-ID': '12345' };
      let amadeusWithHeaders = new Amadeus(Object.assign({}, credentials, { headers: customHeaders }));
      expect(amadeusWithHeaders.client.customHeaders).toEqual(customHeaders);
    });

    it('should have an client property', () => {
      expect(amadeus.client).toBeInstanceOf(Client);
    });

    it('should have an pagination property', () => {
      expect(amadeus.pagination).toBeInstanceOf(Pagination);
    });

    it('should pass .next on to the paginator', () => {
      amadeus.pagination.page = jest.fn();
      amadeus.next({});
      expect(amadeus.pagination.page).toHaveBeenCalledWith('next', {});
    });

    it('should pass .previous on to the paginator', () => {
      amadeus.pagination.page = jest.fn();
      amadeus.previous({});
      expect(amadeus.pagination.page).toHaveBeenCalledWith('previous', {});
    });

    it('should pass .first on to the paginator', () => {
      amadeus.pagination.page = jest.fn();
      amadeus.first({});
      expect(amadeus.pagination.page).toHaveBeenCalledWith('first', {});
    });

    it('should pass .last on to the paginator', () => {
      amadeus.pagination.page = jest.fn();
      amadeus.last({});
      expect(amadeus.pagination.page).toHaveBeenCalledWith('last', {});
    });

    describe('.setCustomHeaders', () => {
      it('should set custom headers on the client', () => {
        let customHeaders = { 'X-New-Header': 'test-value', 'X-Updated': 'updated-value' };
        amadeus.setCustomHeaders(customHeaders);
        expect(amadeus.client.customHeaders).toEqual(customHeaders);
      });

      it('should merge with existing custom headers', () => {
        amadeus.client.customHeaders = { 'X-Old-Header': 'old-value' };
        let newHeaders = { 'X-New-Header': 'new-value' };
        amadeus.setCustomHeaders(newHeaders);
        expect(amadeus.client.customHeaders).toEqual({
          'X-Old-Header': 'old-value',
          'X-New-Header': 'new-value'
        });
      });

      it('should override existing header values with same key', () => {
        amadeus.client.customHeaders = { 'X-Header': 'old-value', 'X-Keep': 'keep-value' };
        let newHeaders = { 'X-Header': 'new-value' };
        amadeus.setCustomHeaders(newHeaders);
        expect(amadeus.client.customHeaders).toEqual({
          'X-Header': 'new-value',
          'X-Keep': 'keep-value'
        });
      });

      it('should accept empty object', () => {
        amadeus.client.customHeaders = { 'X-Existing': 'existing-value' };
        amadeus.setCustomHeaders({});
        expect(amadeus.client.customHeaders).toEqual({ 'X-Existing': 'existing-value' });
      });

      it('should throw error for non-object input', () => {
        expect(() => amadeus.setCustomHeaders('invalid')).toThrowError('Headers must be an object');
        expect(() => amadeus.setCustomHeaders(null)).toThrowError('Headers must be an object');
        expect(() => amadeus.setCustomHeaders(123)).toThrowError('Headers must be an object');
      });
    });

    describe('.getCustomHeaders', () => {
      it('should return current custom headers', () => {
        let customHeaders = { 'X-Test-Header': 'test-value' };
        amadeus.client.customHeaders = customHeaders;
        expect(amadeus.getCustomHeaders()).toEqual(customHeaders);
      });

      it('should return empty object when no headers set', () => {
        amadeus.client.customHeaders = undefined;
        expect(amadeus.getCustomHeaders()).toEqual({});
      });
    });

    describe('.removeCustomHeaders', () => {
      beforeEach(() => {
        amadeus.client.customHeaders = {
          'X-Header1': 'value1',
          'X-Header2': 'value2',
          'X-Header3': 'value3'
        };
      });

      it('should remove specific headers by name', () => {
        amadeus.removeCustomHeaders(['X-Header1', 'X-Header3']);
        expect(amadeus.client.customHeaders).toEqual({
          'X-Header2': 'value2'
        });
      });

      it('should handle removing non-existent headers gracefully', () => {
        amadeus.removeCustomHeaders(['X-NonExistent', 'X-Header1']);
        expect(amadeus.client.customHeaders).toEqual({
          'X-Header2': 'value2',
          'X-Header3': 'value3'
        });
      });

      it('should clear all headers when called with no arguments', () => {
        amadeus.removeCustomHeaders();
        expect(amadeus.client.customHeaders).toEqual({});
      });

      it('should clear all headers when called with null', () => {
        amadeus.removeCustomHeaders(null);
        expect(amadeus.client.customHeaders).toEqual({});
      });

      it('should handle empty array', () => {
        const originalHeaders = Object.assign({}, amadeus.client.customHeaders);
        amadeus.removeCustomHeaders([]);
        expect(amadeus.client.customHeaders).toEqual(originalHeaders);
      });

      it('should throw error for invalid input', () => {
        expect(() => amadeus.removeCustomHeaders('invalid')).toThrowError('headerNames must be an array or null');
        expect(() => amadeus.removeCustomHeaders(123)).toThrowError('headerNames must be an array or null');
      });
    });
  });
});
