const showErrorMessage = (inputElement, feedbackElement, message) => {
  inputElement.classList.add('is-invalid');
  feedbackElement.classList.add('invalid-feedback');
  feedbackElement.textContent = message;
};

const showSuccessMessage = (inputElement, feedbackElement, message) => {
  inputElement.classList.remove('is-invalid');
  feedbackElement.classList.remove('invalid-feedback');
  feedbackElement.classList.add('valid-feedback');
  feedbackElement.textContent = message;
};

const formActions = {
  submitted: showSuccessMessage,
  failed: showErrorMessage,
  idle: () => {},
};

const render = (state) => {
  const { status, message } = state.subscriptionForm;
  const inputElement = document.querySelector('#rss-url');
  const feedbackElement = document.querySelector('#rss-url-feedback');
  formActions[status](inputElement, feedbackElement, message);
  inputElement.focus();
};

export default render;
