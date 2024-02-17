/* eslint import/prefer-default-export: warn */

import noop from 'lodash/noop';
import { loadFeedContents } from './http';
import { parseXmlString, getFeedDetails } from './utils';

const subscribeToFeedUpdates = (state, interval = 5000) => setInterval(
  () => Promise.allSettled(state.feedUrls.map(loadFeedContents))
    .then((results) => results
      .filter(({ status }) => status === 'fulfilled')
      .map(({ value }) => {
        const xmlDoc = parseXmlString(value.data.contents);
        const error = xmlDoc.querySelector('parsererror');
        return error ? null : getFeedDetails(xmlDoc);
      })
      .filter(Boolean)
      .flatMap(({ items }) => items)
      .filter((post) => Date.parse(post.publishedAt) >= (Date.now() - interval)))
    .then((newPosts) => {
      state.posts = [...newPosts, ...state.posts];
    })
    .catch(noop),
  interval,
);

export { subscribeToFeedUpdates };
