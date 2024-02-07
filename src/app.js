import { makeAutoObservable, autorun } from 'mobx';
import i18next from 'i18next';
import { string, setLocale } from 'yup';
import render from './render';
import resources from './locales';
import { FormStatuses } from './constants';

const app = () => {
  const state = makeAutoObservable({
    feeds: [],
    subscriptionForm: {
      status: FormStatuses.IDLE,
      message: '',
    },
  });

  autorun(() => render(state));

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
      test: (url) => !state.feeds.includes(url),
      message: 'duplicatedValue',
    });

  const subscriptionForm = document.querySelector('#subscription-form');

  subscriptionForm.addEventListener('submit', (e) => {
    const formData = new FormData(e.target);
    const rssUrl = formData.get('rss-url');
    urlSchema.validate(rssUrl)
      .then((url) => {
        state.feeds.push(url);
        state.subscriptionForm.status = FormStatuses.SUBMITTED;
        state.subscriptionForm.message = '';
        e.target.reset();
      })
      .catch((err) => {
        state.subscriptionForm.status = FormStatuses.FAILED;
        state.subscriptionForm.message = err.message;
      });
    e.preventDefault();
  });
};

export default app;
