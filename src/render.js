import { t } from 'i18next';
import noop from 'lodash/noop';
import {
  createSectionHeading,
  createUnorderedList,
  createFeed,
  createPost,
} from './elements';
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

const showErrorMessage = (form, message) => {
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

const showSuccessMessage = (form, message) => {
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

const renderForm = (state, formElement) => {
  const { status, message } = state.subscriptionForm;
  const act = formActions[status];
  act(formElement, message);
};

const renderFeeds = (state, container) => {
  container.innerHTML = '';
  const headingText = t('feeds.heading');
  const heading = createSectionHeading(headingText);
  const feeds = state.feeds.map(createFeed);
  const feedsList = createUnorderedList(feeds);
  container.append(heading, feedsList);
};

const renderPosts = (state, container) => {
  container.innerHTML = '';
  const headingText = t('posts.heading');
  const heading = createSectionHeading(headingText);
  const posts = state.posts.map(createPost);
  const postsList = createUnorderedList(posts);
  container.append(heading, postsList);
};

export { renderForm, renderFeeds, renderPosts };
