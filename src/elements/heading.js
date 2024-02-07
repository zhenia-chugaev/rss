const createSectionHeading = (text) => {
  const headingElement = document.createElement('h2');
  headingElement.textContent = text;
  headingElement.classList.add('h4', 'mb-4');
  return headingElement;
};

export default createSectionHeading;
