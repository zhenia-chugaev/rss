import axios from 'axios';
import merge from 'lodash/merge';

const httpClient = axios.create({
  baseURL: 'https://allorigins.hexlet.app',
  params: {
    disableCache: true,
  },
});

const loadFeedContents = (url, options = {}) => {
  const initialOptions = {
    params: { url },
  };
  const config = merge(initialOptions, options);
  return httpClient.get('/get', config);
};

export default httpClient;
export { loadFeedContents };
