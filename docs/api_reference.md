/**
 * Fetches data from the specified API endpoint.
 *
 * @param {string} url - The URL of the API endpoint.
 * @param {Object} [options] - Optional settings for the fetch request.
 * @param {string} [options.method='GET'] - The HTTP method to use for the request.
 * @param {Object} [options.headers] - Headers to include in the request.
 * @param {Object} [options.body] - The body of the request for POST/PUT methods.
 * @returns {Promise<Object>} - A promise that resolves to the response data.
 *
 * @throws {Error} If the fetch request fails or the response is not ok.
 *
 * @example
 * fetchData('https://api.example.com/data')
 *   .then(data => console.log(data))
 *   .catch(error => console.error('Error:', error));
 */