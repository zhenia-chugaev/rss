const createFeed = (feed) => {
  const feedElement = document.createElement('div');
  const titleElement = document.createElement('h3');
  const paragraphElement = document.createElement('p');

  titleElement.textContent = feed.title;
  titleElement.classList.add('h6', 'mb-0');

  paragraphElement.textContent = feed.description;
  paragraphElement.classList.add('m-0', 'text-secondary', 'small');

  feedElement.append(titleElement, paragraphElement);

  return feedElement;
};

export default createFeed;
