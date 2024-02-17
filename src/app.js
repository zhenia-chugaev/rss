import { makeAutoObservable, reaction, when } from 'mobx';
import i18next from 'i18next';
import { string, setLocale } from 'yup';
import { renderForm, renderFeeds, renderPosts } from './render';
import { onSubscriptionFormSubmit, subscribeToFeedUpdates } from './controllers';
import resources from './locales';
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

  const i18n = i18next.createInstance();

  i18n.init({
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

  subscriptionForm.addEventListener('submit', onSubscriptionFormSubmit(state, urlSchema));

  reaction(() => state.subscriptionForm, () => renderForm(state, subscriptionForm, i18n));
  reaction(() => state.feeds, () => renderFeeds(state, feedsContainer, i18n));
  reaction(() => state.posts, () => renderPosts(state, postsContainer, i18n));

  when(() => state.feedUrls.length, () => subscribeToFeedUpdates(state));
};

export default app;
