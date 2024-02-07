import { t } from 'i18next';
import noop from 'lodash/noop';
import { FormStatuses } from './constants';

const {
  IDLE,
  FAILED,
  LOADING,
  SUBMITTED,
} = FormStatuses;

const createFeedListItem = (feed) => {
  const listItem = document.createElement('li');
  const headingElement = document.createElement('h3');
  const paragraphElement = document.createElement('p');

  headingElement.textContent = feed.title;
  headingElement.classList.add('h6', 'mb-0');

  paragraphElement.textContent = feed.description;
  paragraphElement.classList.add('m-0', 'text-secondary', 'small');

  listItem.append(headingElement, paragraphElement);

  return listItem;
};

const createPostListItem = (post) => {
  const listItem = document.createElement('li');
  const linkElement = document.createElement('a');
  const buttonElement = document.createElement('button');

  linkElement.textContent = post.title;
  linkElement.classList.add('fw-semibold');
  linkElement.setAttribute('href', post.link);
  linkElement.setAttribute('target', '_blank');

  buttonElement.textContent = t('posts.modalButton');
  buttonElement.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  buttonElement.setAttribute('type', 'button');

  listItem.append(linkElement, buttonElement);
  listItem.classList.add('d-flex', 'align-items-center', 'justify-content-between');

  return listItem;
};

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

  const headingElement = document.createElement('h2');
  headingElement.textContent = t('feeds.heading');
  headingElement.classList.add('h4', 'mb-4');

  const listElement = document.createElement('ul');
  listElement.classList.add('list-unstyled', 'm-0', 'd-flex', 'flex-column', 'gap-3');
  listElement.append(...state.feeds.map(createFeedListItem));

  container.append(headingElement, listElement);
};

const renderPosts = (state, container) => {
  container.innerHTML = '';

  const headingElement = document.createElement('h2');
  headingElement.textContent = t('posts.heading');
  headingElement.classList.add('h4', 'mb-4');

  const listElement = document.createElement('ul');
  listElement.classList.add('list-unstyled', 'm-0', 'd-flex', 'flex-column', 'gap-3');
  listElement.append(...state.posts.map(createPostListItem));

  container.append(headingElement, listElement);
};

export { renderForm, renderFeeds, renderPosts };
