import { makeAutoObservable, autorun } from 'mobx';
import axios from 'axios';
import i18next from 'i18next';
import { string, setLocale } from 'yup';
import render from './render';
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

  autorun(() => render(state));

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
        state.subscriptionForm.message = '';
        state.subscriptionForm.status = FormStatuses.LOADING;
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
        state.subscriptionForm.message = 'subscriptionForm.feedback.rssLoaded';
        state.subscriptionForm.status = FormStatuses.SUBMITTED;
        e.target.reset();
      })
      .catch((err) => {
        state.subscriptionForm.status = FormStatuses.FAILED;
        state.subscriptionForm.message = getTranslationKeyFromError(err);
      });
    e.preventDefault();
  });
};

export default app;
