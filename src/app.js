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

  reaction(() => state.subscriptionForm, () => renderForm(state));
  reaction(() => state.feeds, () => renderFeeds(state));
  reaction(() => state.posts, () => renderPosts(state));

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

  subscriptionForm.addEventListener('submit', (e) => {
    const formData = new FormData(e.target);
    const rssUrl = formData.get('rss-url');
    urlSchema.validate(rssUrl)
      .then((url) => {
        state.subscriptionForm = {
          status: FormStatuses.LOADING,
          message: '',
        };
        return httpClient.get('/raw', { params: { url } });
      })
      .then(({ data }) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'application/xml');
        const error = xmlDoc.querySelector('parsererror');

        if (error) {
          throw new Error('invalidRss');
        }

        const { title, description, items } = getFeedDetails(xmlDoc);
        const newFeed = { title, description };

        state.feeds = [newFeed, ...state.feeds];
        state.posts = [...items, ...state.posts];
      })
      .then(() => {
        state.feedUrls.push(rssUrl);
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
};

export default app;
