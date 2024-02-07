const createListItem = (child) => {
  const listItem = document.createElement('li');
  listItem.append(child);
  return listItem;
};

const createUnorderedList = (items) => {
  const listElement = document.createElement('ul');
  const listItems = items.map(createListItem);
  listElement.classList.add('list-unstyled', 'm-0', 'd-flex', 'flex-column', 'gap-3');
  listElement.append(...listItems);
  return listElement;
};

export default createUnorderedList;
