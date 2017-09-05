'use strict';

(function () {
  var photoTemplate = document
      .querySelector('#picture-template')
      .content
      .querySelector('.picture');

  window.picture = {
    getPhotoElement: function (photos) {
      var photo = photoTemplate.cloneNode(true);

      photo.querySelector('.picture > img').src = photos.url;
      photo.querySelector('.picture-likes').textContent = photos.likes;
      photo.querySelector('.picture-comments').textContent = photos.comments.length;

      return photo;
    },
  };
})();
