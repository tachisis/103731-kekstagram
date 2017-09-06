'use strict';

(function () {
  var uploadForm = document.querySelector('#upload-select-image');
  var uploadFile = uploadForm.querySelector('#upload-file');
  var uploadImage = uploadForm.querySelector('.upload-image');
  var uploadOverlay = uploadForm.querySelector('.upload-overlay');
  var uploadCancel = uploadForm.querySelector('.upload-form-cancel');
  var uploadComment = uploadForm.querySelector('.upload-form-description');
  var uploadResizeValue = uploadForm.querySelector('.upload-resize-controls-value');
  var uploadResizeInc = uploadForm.querySelector('.upload-resize-controls-button-inc');
  var uploadResizeDec = uploadForm.querySelector('.upload-resize-controls-button-dec');
  var uploadEffects = uploadForm.querySelector('.upload-effect-controls');
  var uploadImagePreview = uploadForm.querySelector('.effect-image-preview');
  var uploadHashtags = uploadForm.querySelector('.upload-form-hashtags');

  var effectClass = null;

  var HashtagsOption = {
    AMOUNT: 5,
    LENGTH: 20,
    SYMBOL: '#'
  };

  var ResizeOption = {
    DEFAULT: 100,
    STEP: 25,
    MIN: 25,
    MAX: 100
  };

  function closeUploadOverlay() {
    uploadOverlay.classList.toggle('hidden');
    uploadImage.classList.toggle('hidden');
    uploadCancel.removeEventListener('click', onUploadCancelClick);
    document.removeEventListener('keydown', onUploadOverlayEsc);
  }

  function updateResizeBtnState(newSize) {
    if (uploadResizeDec.hasAttribute('disabled') && newSize >= ResizeOption.MIN) {
      uploadResizeDec.removeAttribute('disabled');
    }
    if (uploadResizeInc.hasAttribute('disabled') && newSize <= ResizeOption.MAX) {
      uploadResizeInc.removeAttribute('disabled');
    }
    if (newSize === ResizeOption.MAX) {
      uploadResizeInc.setAttribute('disabled', 'disabled');
    }
    if (newSize === ResizeOption.MIN) {
      uploadResizeDec.setAttribute('disabled', 'disabled');
    }
  }

  function setNewSize(newSize) {
    if (newSize <= ResizeOption.MAX && newSize >= ResizeOption.MIN) {
      uploadResizeValue.setAttribute('value', newSize + '%');
      uploadImagePreview.setAttribute('style', 'transform: scale(' + newSize / 100 + ')');
      updateResizeBtnState(newSize);
    }
  }

  function resizeInc() {
    var initialSize = parseInt(uploadResizeValue.getAttribute('value'), 10);
    var newSize = initialSize + ResizeOption.STEP;
    setNewSize(newSize);
  }

  function resizeDec() {
    var initialSize = parseInt(uploadResizeValue.getAttribute('value'), 10);
    var newSize = initialSize - ResizeOption.STEP;
    setNewSize(newSize);
  }

  function onUploadCancelClick(evt) {
    closeUploadOverlay(evt);
  }

  function onUploadOverlayEsc(evt) {
    if (window.util.isEscEvent(evt) && evt.target !== uploadComment) {
      closeUploadOverlay(evt);
      uploadForm.reset();
    }
  }

  function onResizeIncClick(evt) {
    resizeInc();
  }

  function onResizeDecClick(evt) {
    resizeDec();
  }

  function onEffectsClick(evt) {
    if (evt.target.tagName === 'INPUT') {
      uploadImagePreview.classList.remove(effectClass);
      effectClass = 'effect-' + evt.target.value;
      uploadImagePreview.classList.add(effectClass);
    }
  }

  function showEditForm() {
    uploadImage.classList.toggle('hidden');
    uploadOverlay.classList.toggle('hidden');
  }

  function initUploadClose() {
    document.addEventListener('keydown', onUploadOverlayEsc);
    uploadCancel.addEventListener('click', onUploadCancelClick);
  }

  function initResize() {
    updateResizeBtnState(parseInt(uploadResizeValue.getAttribute('value'), 10));
    uploadResizeInc.addEventListener('click', onResizeIncClick);
    uploadResizeDec.addEventListener('click', onResizeDecClick);
  }

  function initEffects() {
    uploadEffects.addEventListener('click', onEffectsClick);
  }

  function initValidation() {
    uploadHashtags.setAttribute('pattern', '('
      + HashtagsOption.SYMBOL
      + '\\w{1,'
      + HashtagsOption.LENGTH
      + '}\\b ?){0,'
      + HashtagsOption.AMOUNT
      + '}');

    uploadComment.addEventListener('invalid', function (evt) {
      if (uploadComment.validity.valueMissing) {
        uploadComment.setCustomValidity('Комментарий необходимо заполнить');
      } else if (uploadComment.validity.tooShort) {
        uploadComment.setCustomValidity('Комментарий должен быть не меньше '
          + uploadComment.getAttribute('minlength')
          + ' символов');
      } else if (uploadComment.validity.tooLong) {
        uploadComment.setCustomValidity('Комментарий должен быть не больше '
          + uploadComment.getAttribute('maxlength')
          + ' символов');
      } else {
        uploadComment.setCustomValidity('');
      }
    });

    uploadHashtags.addEventListener('invalid', function (evt) {
      if (uploadHashtags.validity.patternMismatch) {
        uploadHashtags.setCustomValidity('Хэштегов не должно быть больше '
          + HashtagsOption.AMOUNT
          + ', они должны начинаться с '
          + HashtagsOption.SYMBOL
          + ', состоять из одного слова не больше '
          + HashtagsOption.LENGTH
          + ' символов, разделяться пробелами');
      } else if (uploadHashtags.validity.customError) {
        uploadHashtags.setCustomValidity('Хэштеги не должны повторяться');
      } else {
        uploadHashtags.setCustomValidity('');
      }
    });

    uploadHashtags.addEventListener('input', function (evt) {
      var hashtagsString = uploadHashtags.value;
      if (hashtagsString.trim() !== '') {
        var hashTags = hashtagsString.split(' ');
        hashTags.sort();
        for (var i = 1; i < hashTags.length; i++) {
          if (hashTags[i] === hashTags[i - 1]) {
            uploadHashtags.setCustomValidity('Хэштеги не должны повторяться');
          } else {
            uploadHashtags.setCustomValidity('');
          }
        }
      }
    });
  }

  function onUploadPhoto(evt) {
    showEditForm();
    initUploadClose();
    initResize();
    initEffects();
    initValidation();
  }

  uploadFile.addEventListener('change', onUploadPhoto);
})();
