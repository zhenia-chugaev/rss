import camelCase from 'lodash/camelCase';

const getFeedItemDetails = (itemElement) => {
  const titleElement = itemElement.querySelector('title');
  const linkElement = itemElement.querySelector('link');
  const title = titleElement.textContent;
  const link = linkElement.textContent;
  return { title, link };
};

const getFeedDetails = (doc) => {
  const titleElement = doc.querySelector('title');
  const descriptionElement = doc.querySelector('description');
  const itemElements = doc.querySelectorAll('item');
  const title = titleElement.textContent;
  const description = descriptionElement.textContent;
  const items = Array.from(itemElements, getFeedItemDetails);
  return { title, description, items };
};

const getTranslationKeyFromError = (error) => {
  const { isAxiosError, code, message } = error;
  return isAxiosError
    ? `network.errors.${camelCase(code)}`
    : `subscriptionForm.feedback.${message}`;
};

export { getFeedDetails, getTranslationKeyFromError };
