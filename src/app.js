import { makeAutoObservable, reaction } from 'mobx';
import axios from 'axios';
import i18next from 'i18next';
import { string, setLocale } from 'yup';
import { renderForm, renderFeeds, renderPosts } from './render';
import resources from './locales';
import { getFeedDetails, getTranslationKeyFromError } from './utils';
import { FormStatuses } from './constants';

const app = () => {
  const state = makeAutoObservable({
    feedUrls: [],
    subscriptionForm: {
      status: FormStatuses.IDLE,
      message: '',
    },
    feeds: [],
    posts: [],
  });

  const httpClient = axios.create({
    baseURL: 'https://allorigins.hexlet.app',
  });

  i18next.init({
    lng: 'ru',
    resources,
  });

  setLocale({
    string: {
      url: 'invalidUrl',
    },
    mixed: {
      required: 'requiredField',
    },
  });

  const urlSchema = string()
    .url()
    .required()
    .trim()
    .lowercase()
    .test({
      test: (url) => !state.feedUrls.includes(url),
      message: 'duplicatedValue',
    });

  const subscriptionForm = document.querySelector('#subscription-form');
  const feedsContainer = document.querySelector('#feeds');
  const postsContainer = document.querySelector('#posts');

  subscriptionForm.addEventListener('submit', (e) => {
    const formData = new FormData(e.target);
    const rssUrl = formData.get('rss-url');
    urlSchema.validate(rssUrl)
      .then((url) => {
        state.subscriptionForm = {
          status: FormStatuses.LOADING,
          message: '',
        };
        return httpClient.get('/get', {
          params: {
            url,
            disableCache: true,
          },
        });
      })
      .then(({ data }) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, 'application/xml');
        const error = xmlDoc.querySelector('parsererror');

        if (error) {
          throw new Error('invalidRss');
        }

        const { title, description, items } = getFeedDetails(xmlDoc);
        const newFeed = { title, description };

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
  });

  reaction(() => state.subscriptionForm, () => renderForm(state, subscriptionForm));
  reaction(() => state.feeds, () => renderFeeds(state, feedsContainer));
  reaction(() => state.posts, () => renderPosts(state, postsContainer));
};

export default app;
