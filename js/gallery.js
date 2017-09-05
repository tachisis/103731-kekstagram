'use strict';

(function () {
  function renderPhotos(photos, target) {
    var photosListElement = document.querySelector(target);
    var fragment = document.createDocumentFragment();
    var count = photos.length;

    for (var i = 0; i < count; i++) {
      var photoElem = window.picture.getPhotoElement(photos[i]);
      window.preview.addPhotoOpenHandlers(photoElem, i, photos);
      fragment.appendChild(photoElem);
    }

    photosListElement.appendChild(fragment);
  }

  var photos = window.data.getPhotos(window.data.COMMENTS, 25);
  renderPhotos(photos, '.pictures');
})();
