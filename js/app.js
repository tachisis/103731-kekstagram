'use strict';

(function () {
  var photoTemplate = document
      .querySelector('#picture-template')
      .content
      .querySelector('.picture');

  function getPhotoElement(photos) {
    var photo = photoTemplate.cloneNode(true);

    photo.querySelector('.picture > img').src = photos.url;
    photo.querySelector('.picture-likes').textContent = photos.likes;
    photo.querySelector('.picture-comments').textContent = photos.comments.length;

    return photo;
  }

  function addPhotoOpenHandlers(elem, i, photo) {
    elem.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.openPhoto(photo, i);
    });

    elem.addEventListener('keydown', function (evt) {
      if (window.util.isActivationEvent(evt)) {
        evt.preventDefault();
        window.openPhoto(photo, i);
      }
    });
  }

  function renderPhotos(photos, target) {
    var photosListElement = document.querySelector(target);
    var fragment = document.createDocumentFragment();
    var count = photos.length;

    for (var i = 0; i < count; i++) {
      var photo = photos[i];
      var elem = getPhotoElement(photo);
      addPhotoOpenHandlers(elem, i, photo);
      fragment.appendChild(elem);
    }

    photosListElement.appendChild(fragment);
  }

  renderPhotos(window.getPhotos(25), '.pictures');
})();
