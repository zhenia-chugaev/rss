import { makeAutoObservable, autorun } from 'mobx';
import { string } from 'yup';
import render from './render';

const app = () => {
  const state = makeAutoObservable({
    feeds: [],
    subscriptionForm: {
      status: 'idle',
      message: '',
    },
  });

  autorun(() => render(state));

  const urlSchema = string()
    .url()
    .required()
    .trim()
    .lowercase()
    .test({
      test: (url) => !state.feeds.includes(url),
      message: 'this subscription already exists',
    });

  const subscriptionForm = document.querySelector('#subscription-form');

  subscriptionForm.addEventListener('submit', (e) => {
    const formData = new FormData(e.target);
    const rssUrl = formData.get('rss-url');
    urlSchema.validate(rssUrl)
      .then((url) => {
        state.feeds.push(url);
        state.subscriptionForm.status = 'submitted';
        state.subscriptionForm.message = 'RSS успешно загружен';
        e.target.reset();
      })
      .catch((err) => {
        state.subscriptionForm.status = 'failed';
        state.subscriptionForm.message = err.message;
      });
    e.preventDefault();
  });
};

export default app;
