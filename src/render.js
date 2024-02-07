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
};

const showSuccessMessage = (form, message) => {
  const inputElement = form.elements.namedItem('rss-url');
  const feedbackElement = form.querySelector('#rss-url-feedback');
  resetFormElements(inputElement, feedbackElement);
  feedbackElement.classList.add('valid-feedback');
  feedbackElement.textContent = t(message);
  enableFormElements(form);
};

const formActions = {
  [IDLE]: noop,
  [FAILED]: showErrorMessage,
  [LOADING]: disableFormElements,
  [SUBMITTED]: showSuccessMessage,
};

const renderForm = (state) => {
  const { status, message } = state.subscriptionForm;
  const formElement = document.querySelector('#subscription-form');
  formActions[status](formElement, message);
  formElement.elements[0].focus();
};

const renderFeeds = (state) => {
  const feedsContainer = document.querySelector('#feeds');
  feedsContainer.innerHTML = '';

  const headingElement = document.createElement('h2');
  headingElement.textContent = t('feeds.heading');
  headingElement.classList.add('h4', 'mb-4');

  const listElement = document.createElement('ul');
  listElement.classList.add('list-unstyled', 'm-0', 'd-flex', 'flex-column', 'gap-3');
  listElement.append(...state.feeds.map(createFeedListItem));

  feedsContainer.append(headingElement, listElement);
};

const renderPosts = () => {};

export { renderForm, renderFeeds, renderPosts };
