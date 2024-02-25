import noop from 'lodash/noop';
import {
  createSectionHeading,
  createUnorderedList,
  createFeed,
  createPost,
} from './elements';
import { onPostLinkClick } from './controllers';
import { FormStatuses } from './constants';

const {
  IDLE,
  FAILED,
  LOADING,
  SUBMITTED,
} = FormStatuses;

const disableFormElements = (form) => {
  Array.from(form.elements).forEach((element) => {
    element.setAttribute('disabled', '');
  });
};

const enableFormElements = (form) => {
  Array.from(form.elements).forEach((element) => {
    element.removeAttribute('disabled');
  });
};

const resetFormElements = (inputElement, feedbackElement) => {
  inputElement.classList.remove('is-invalid', 'is-valid');
  feedbackElement.classList.remove('invalid-feedback', 'valid-feedback');
  feedbackElement.textContent = '';
};

const showErrorMessage = (form, message, { t }) => {
  const inputElement = form.elements.namedItem('rss-url');
  const feedbackElement = form.querySelector('#rss-url-feedback');
  resetFormElements(inputElement, feedbackElement);
  inputElement.classList.add('is-invalid');
  feedbackElement.classList.add('invalid-feedback');
  feedbackElement.textContent = t([
    message,
    'subscriptionForm.feedback.unknownError',
  ]);
  enableFormElements(form);
  form.elements[0].focus();
};

const showSuccessMessage = (form, message, { t }) => {
  const inputElement = form.elements.namedItem('rss-url');
  const feedbackElement = form.querySelector('#rss-url-feedback');
  resetFormElements(inputElement, feedbackElement);
  feedbackElement.classList.add('valid-feedback');
  feedbackElement.textContent = t(message);
  enableFormElements(form);
  form.elements[0].focus();
};

const formActions = {
  [IDLE]: noop,
  [FAILED]: showErrorMessage,
  [LOADING]: disableFormElements,
  [SUBMITTED]: showSuccessMessage,
};

const renderForm = (state, formElement, i18next) => {
  const { status, message } = state.subscriptionForm;
  const act = formActions[status];
  act(formElement, message, i18next);
};

const renderFeeds = (state, container, { t }) => {
  container.innerHTML = '';
  const headingText = t('feeds.heading');
  const heading = createSectionHeading(headingText);
  const feeds = state.feeds.map(createFeed);
  const feedsList = createUnorderedList(feeds);
  container.append(heading, feedsList);
};

const renderPosts = (state, container, i18next) => {
  container.innerHTML = '';
  const headingText = i18next.t('posts.heading');
  const heading = createSectionHeading(headingText);
  const posts = state.posts.map((post) => (
    createPost(post, onPostLinkClick(state), i18next)
  ));
  const postsList = createUnorderedList(posts);
  container.append(heading, postsList);
};

const renderPostModal = (state, postModal) => {
  const titleElement = postModal.querySelector('#post-modal-title');
  const descriptionElement = postModal.querySelector('#post-modal-description');
  const linkElement = postModal.querySelector('#post-modal-link');

  const { ui: { postModal: { postId } } } = state;

  const {
    title = '',
    link = '#',
    description = '',
  } = (postId && state.posts.find((post) => post.id === postId)) || {};

  titleElement.textContent = title;
  descriptionElement.textContent = description;
  linkElement.setAttribute('href', link);
};

export {
  renderForm,
  renderFeeds,
  renderPosts,
  renderPostModal,
};
