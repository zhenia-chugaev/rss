import { makeAutoObservable, reaction, when } from 'mobx';
import i18next from 'i18next';
import { string, setLocale } from 'yup';
import {
  onSubscriptionFormSubmit,
  subscribeToFeedUpdates,
  onPostModalOpen,
  onPostModalClose,
} from './controllers';
import {
  renderForm,
  renderFeeds,
  renderPosts,
  renderPostModal,
} from './render';
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
    ui: {
      postModal: {
        postId: '',
      },
    },
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
  const postModal = document.querySelector('#post-modal');

  subscriptionForm.addEventListener('submit', onSubscriptionFormSubmit(state, urlSchema));
  postModal.addEventListener('show.bs.modal', onPostModalOpen(state));
  postModal.addEventListener('hide.bs.modal', onPostModalClose(state));

  reaction(() => state.subscriptionForm, () => renderForm(state, subscriptionForm, i18n));
  reaction(() => state.feeds, () => renderFeeds(state, feedsContainer, i18n));
  reaction(() => state.posts, () => renderPosts(state, postsContainer, i18n));
  reaction(() => state.ui.postModal, () => renderPostModal(state, postModal));

  when(() => state.feedUrls.length, () => subscribeToFeedUpdates(state));
};

export default app;
