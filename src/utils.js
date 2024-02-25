import camelCase from 'lodash/camelCase';
import uniqueId from 'lodash/uniqueId';

const parseXmlString = (string) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(string, 'application/xml');
  return xmlDoc;
};

const getFeedItemDetails = (itemElement) => {
  const titleElement = itemElement.querySelector('title');
  const linkElement = itemElement.querySelector('link');
  const descriptionElement = itemElement.querySelector('description');
  const pubDateElement = itemElement.querySelector('pubDate');
  return {
    id: uniqueId(),
    title: titleElement.textContent,
    link: linkElement.textContent,
    description: descriptionElement.textContent,
    publishedAt: pubDateElement.textContent,
    isRead: false,
  };
};

const getFeedDetails = (doc) => {
  const titleElement = doc.querySelector('title');
  const descriptionElement = doc.querySelector('description');
  const itemElements = doc.querySelectorAll('item');
  return {
    id: Date.now(),
    title: titleElement.textContent,
    description: descriptionElement.textContent,
    items: Array.from(itemElements, getFeedItemDetails),
  };
};

const getTranslationKeyFromError = (error) => {
  const { isAxiosError, code, message } = error;
  return isAxiosError
    ? `network.errors.${camelCase(code)}`
    : `subscriptionForm.feedback.${message}`;
};

export { parseXmlString, getFeedDetails, getTranslationKeyFromError };
