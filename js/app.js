'use strict';

(function () {
  var url = 'https://1510.dump.academy/kekstagram/data';

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

  function addPhotoOpenHandlers(elem, photo) {
    elem.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.openPhoto(photo, function () {
        elem.focus();
      });
    });

    elem.addEventListener('keydown', function (evt) {
      if (window.util.isActivationEvent(evt)) {
        evt.preventDefault();
        window.openPhoto(photo, function () {
          elem.focus();
        });
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
      addPhotoOpenHandlers(elem, photo);
      fragment.appendChild(elem);
    }

    photosListElement.appendChild(fragment);
  }

  function onError(message) {
    window.infoMessage(message, 'error');
  };

  function onLoad(data) {
    renderPhotos(data, '.pictures');
  };

  window.backend.load(onLoad, onError);
})();
