'use strict';

(function () {
  var photoOverlay = document.querySelector('.gallery-overlay');
  var photoOverlayClose = photoOverlay.querySelector('.gallery-overlay-close');

  var openedPhoto = null;

  function onCloseButtonKeydown(evt) {
    if (window.util.isActivationEvent(evt)) {
      evt.preventDefault();
      closePhoto(evt);
    }
  }

  function onCloseButtonClick(evt) {
    evt.preventDefault();
    closePhoto(evt);
  }

  function onPhotoOverlayEsc(evt) {
    if (window.util.isEscEvent(evt)) {
      evt.preventDefault();
      closePhoto(evt);
    }
  }

  function closePhoto() {
    photoOverlay.classList.add('hidden');

    var pictures = document.querySelectorAll('.picture');
    pictures[openedPhoto].focus();

    photoOverlayClose.removeEventListener('click', onCloseButtonClick);
    photoOverlayClose.removeEventListener('keydown', onCloseButtonKeydown);
    document.removeEventListener('keydown', onPhotoOverlayEsc);

    openedPhoto = null;
  }

  function fillPhoto(photo, target) {
    target.querySelector('.gallery-overlay-image').src = photo.url;
    target.querySelector('.likes-count').textContent = photo.likes;
    target.querySelector('.comments-count').textContent = photo.comments.length;
  }

  window.openPhoto = function (photo, i) {
    openedPhoto = i;

    fillPhoto(photo, photoOverlay);

    photoOverlay.classList.remove('hidden');
    photoOverlay.focus();

    photoOverlayClose.addEventListener('click', onCloseButtonClick);
    photoOverlayClose.addEventListener('keydown', onCloseButtonKeydown);
    document.addEventListener('keydown', onPhotoOverlayEsc);
  };
})();
