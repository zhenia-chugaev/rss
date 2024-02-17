const createPost = (post, { t }) => {
  const postElement = document.createElement('div');
  const linkElement = document.createElement('a');
  const buttonElement = document.createElement('button');

  linkElement.textContent = post.title;
  linkElement.classList.add('fw-semibold');
  linkElement.setAttribute('href', post.link);
  linkElement.setAttribute('target', '_blank');

  buttonElement.textContent = t('posts.modalButton');
  buttonElement.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  buttonElement.setAttribute('type', 'button');

  postElement.append(linkElement, buttonElement);
  postElement.classList.add('d-flex', 'align-items-center', 'justify-content-between');

  return postElement;
};

export default createPost;
