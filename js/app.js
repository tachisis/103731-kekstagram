'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 300;
  var filters = document.querySelector('.filters');
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
    window.util.clearNode(photosListElement);
    var fragment = document.createDocumentFragment();

    photos.forEach(function (item, i, arr) {
      var photo = photos[i];
      var elem = getPhotoElement(photo);
      addPhotoOpenHandlers(elem, photo);
      fragment.appendChild(elem);
    });

    photosListElement.appendChild(fragment);
  }

  window.backend.load(
      function (data) {
        window.initFilters(filters, data, window.util.debounce(function (sortedData) {
          renderPhotos(sortedData, '.pictures');
        }, DEBOUNCE_INTERVAL));
      },
      function (message) {
        window.showMessage(message, 'error');
      }
  );
})();
