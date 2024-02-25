const createPost = (post, onLinkClick, { t }) => {
  const postElement = document.createElement('div');
  const linkElement = document.createElement('a');
  const buttonElement = document.createElement('button');

  const linkElementClasses = post.isRead
    ? ['fw-normal', 'text-secondary']
    : ['fw-bold'];

  linkElement.textContent = post.title;
  linkElement.classList.add(...linkElementClasses);
  linkElement.setAttribute('href', post.link);
  linkElement.setAttribute('target', '_blank');
  linkElement.setAttribute('data-post-id', post.id);
  linkElement.addEventListener('click', onLinkClick);

  buttonElement.textContent = t('posts.openModalButton');
  buttonElement.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  buttonElement.setAttribute('type', 'button');
  buttonElement.setAttribute('data-bs-toggle', 'modal');
  buttonElement.setAttribute('data-bs-target', '#post-modal');
  buttonElement.setAttribute('data-post-id', post.id);

  postElement.append(linkElement, buttonElement);
  postElement.classList.add('d-flex', 'align-items-center', 'justify-content-between');

  return postElement;
};

export default createPost;
