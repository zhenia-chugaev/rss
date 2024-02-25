import noop from 'lodash/noop';
import { loadFeedContents } from './http';
import { parseXmlString, getFeedDetails, getTranslationKeyFromError } from './utils';
import { FormStatuses } from './constants';

const onSubscriptionFormSubmit = (state, urlSchema) => (e) => {
  const formData = new FormData(e.target);
  const rssUrl = formData.get('rss-url');
  urlSchema.validate(rssUrl)
    .then((url) => {
      state.subscriptionForm = {
        status: FormStatuses.LOADING,
        message: '',
      };
      return loadFeedContents(url);
    })
    .then(({ data }) => {
      const xmlDoc = parseXmlString(data.contents);
      const error = xmlDoc.querySelector('parsererror');

      if (error) {
        throw new Error('invalidRss');
      }

      const { items, ...newFeed } = getFeedDetails(xmlDoc);

      state.feeds = [newFeed, ...state.feeds];
      state.posts = [...items, ...state.posts];

      return data.status.url;
    })
    .then((feedUrl) => {
      state.feedUrls.push(feedUrl);
      state.subscriptionForm = {
        status: FormStatuses.SUBMITTED,
        message: 'subscriptionForm.feedback.rssLoaded',
      };
      e.target.reset();
    })
    .catch((err) => {
      state.subscriptionForm = {
        status: FormStatuses.FAILED,
        message: getTranslationKeyFromError(err),
      };
    });
  e.preventDefault();
};

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

export { onSubscriptionFormSubmit, subscribeToFeedUpdates };
