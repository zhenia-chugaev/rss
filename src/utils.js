import camelCase from 'lodash/camelCase';

const parseXmlString = (string) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(string, 'application/xml');
  return xmlDoc;
};

const getFeedItemDetails = (itemElement) => {
  const titleElement = itemElement.querySelector('title');
  const linkElement = itemElement.querySelector('link');
  const pubDateElement = itemElement.querySelector('pubDate');
  const title = titleElement.textContent;
  const link = linkElement.textContent;
  const publishedAt = pubDateElement.textContent;
  return { title, link, publishedAt };
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

export { parseXmlString, getFeedDetails, getTranslationKeyFromError };
