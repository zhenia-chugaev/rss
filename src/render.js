import { t } from 'i18next';
import { FormStatuses } from './constants';

const { SUBMITTED, FAILED, IDLE } = FormStatuses;

const showErrorMessage = (inputElement, feedbackElement, message) => {
  inputElement.classList.add('is-invalid');
  feedbackElement.classList.add('invalid-feedback');
  feedbackElement.textContent = t(`subscriptionForm.feedback.${message}`);
};

const resetFormElements = (inputElement, feedbackElement) => {
  inputElement.classList.remove('is-invalid');
  feedbackElement.classList.remove('invalid-feedback');
  feedbackElement.textContent = '';
};

const formActions = {
  [SUBMITTED]: resetFormElements,
  [FAILED]: showErrorMessage,
  [IDLE]: () => {},
};

const render = (state) => {
  const { status, message } = state.subscriptionForm;
  const inputElement = document.querySelector('#rss-url');
  const feedbackElement = document.querySelector('#rss-url-feedback');
  formActions[status](inputElement, feedbackElement, message);
  inputElement.focus();
};

export default render;
