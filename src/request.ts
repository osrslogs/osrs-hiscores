import axios, { AxiosRequestConfig } from 'axios';
import { ServiceUnavailableError, NotFoundError, HttpError } from './util/error';
import { Config } from './types';

/**
 * Builds the Axios Config with needed properties
 *
 * @param {Config} config The config to use for the request
 *
 * @returns {AxiosRequestConfig}
 */
const buildAxiosConfig = (config: Config): AxiosRequestConfig => ({
  headers: {
    'user-agent': config.userAgent
      ? config.userAgent
      : 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1',
    accept: 'text/html',
    'accept-encoding': 'gzip',
  },
  maxRedirects: 0, // OSRS Hiscores redirects to 303->302->200 when in reality it is 500
  proxy: config.proxy,
  timeout: config.timeout,
  responseType: 'text',
});

/**
 * Fetches a OSRS Hiscore url and returns the contents
 *
 * @param {string} url The url to fetch
 * @param {Config} config The config to use for the request
 *
 * @returns {string} The page content
 *
 * @throws {ServiceUnavailableError} If hiscores are unavailable
 * @throws {NotFoundError} If hiscores did not find player
 * @throws {HttpError} If hiscores request failed unexpectedly
 */
const request = async (url: string, config: Config): Promise<string> => {
  const axiosConfig = buildAxiosConfig(config);
  try {
    const res = await axios.get(url, axiosConfig);
    return res.data;
  } catch (err) {
    // Handle timeout requests as if hiscores are unavailable
    if (err.code === 'ECONNABORTED' || err.response?.status === 303) {
      throw new ServiceUnavailableError('Hiscores are unavailable');
    }
    if (err.response?.status === 404) {
      throw new NotFoundError('Hiscores did not find player');
    }
    // should never occur
    throw new HttpError('Hiscores unexpected error');
  }
};

export default request;
