'use strict';

(function () {
  var photoOverlay = document.querySelector('.gallery-overlay');
  var photoOverlayClose = photoOverlay.querySelector('.gallery-overlay-close');

  var onPreviewClose = null;

  function onCloseButtonKeydown(evt) {
    if (window.util.isActivationEvent(evt)) {
      evt.preventDefault();
      closePhoto();
    }
  }

  function onCloseButtonClick(evt) {
    evt.preventDefault();
    closePhoto();
  }

  function onPhotoOverlayEsc(evt) {
    if (window.util.isEscEvent(evt)) {
      evt.preventDefault();
      closePhoto();
    }
  }

  function closePhoto() {
    photoOverlay.classList.add('hidden');

    photoOverlayClose.removeEventListener('click', onCloseButtonClick);
    photoOverlayClose.removeEventListener('keydown', onCloseButtonKeydown);
    document.removeEventListener('keydown', onPhotoOverlayEsc);

    if (typeof onPreviewClose === 'function') {
      onPreviewClose();
    }
  }

  function fillPhoto(photo) {
    photoOverlay.querySelector('.gallery-overlay-image').src = photo.url;
    photoOverlay.querySelector('.likes-count').textContent = photo.likes;
    photoOverlay.querySelector('.comments-count').textContent = photo.comments.length;
  }

  window.openPhoto = function (photo, onClose) {
    fillPhoto(photo);

    photoOverlay.classList.remove('hidden');
    photoOverlay.focus();

    photoOverlayClose.addEventListener('click', onCloseButtonClick);
    photoOverlayClose.addEventListener('keydown', onCloseButtonKeydown);
    document.addEventListener('keydown', onPhotoOverlayEsc);

    onPreviewClose = onClose;
  };
})();
