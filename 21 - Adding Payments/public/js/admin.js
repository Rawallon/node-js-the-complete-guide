const deleteProduct = (btnNode) => {
  const prodId = btnNode.parentNode.querySelector('[name=productId]').value;
  const crsf = btnNode.parentNode.querySelector('[name=_csrf]').value;
  const parentElement = btnNode.closest('article');

  fetch(`/admin/product/${prodId}`, {
    method: 'DELETE',
    headers: {
      'csrf-token': crsf,
    },
  })
    .then((res) => parentElement.parentNode.removeChild(parentElement))
    .catch((err) => console.error(err));
};
