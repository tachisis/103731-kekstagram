'use strict';

(function () {
  var HashtagsOption = {
    AMOUNT: 5,
    LENGTH: 20,
    SYMBOL: '#'
  };

  var InitialEffect = {
    CHROME: 1,
    SEPIA: 1,
    MARVIN: 100,
    PHOBOS: 3,
    HEAT: 3
  };

  var uploadForm = document.querySelector('#upload-select-image');
  var uploadFile = uploadForm.querySelector('#upload-file');
  var uploadImage = uploadForm.querySelector('.upload-image');
  var uploadOverlay = uploadForm.querySelector('.upload-overlay');
  var uploadCancel = uploadForm.querySelector('.upload-form-cancel');
  var uploadSubmit = uploadForm.querySelector('.upload-form-submit');
  var uploadComment = uploadForm.querySelector('.upload-form-description');
  var scaleElem = uploadForm.querySelector('.upload-resize-controls');
  var uploadResizeValue = uploadForm.querySelector('.upload-resize-controls-value');
  var uploadImagePreview = uploadForm.querySelector('.effect-image-preview');
  var uploadHashtags = uploadForm.querySelector('.upload-form-hashtags');

  var validationMessage = null;

  function closeUploadOverlay() {
    uploadOverlay.classList.toggle('hidden');
    uploadImage.classList.toggle('hidden');
    uploadCancel.removeEventListener('click', onUploadCancelClick);
    document.removeEventListener('keydown', onUploadOverlayEsc);
  }

  function setNewSize(newSize) {
    uploadResizeValue.value = newSize + '%';
    uploadImagePreview.style.transform = 'scale(' + newSize / 100 + ')';
  }

  function setEffectIntensity(effectName, intensity) {
    var newFilter = null;
    switch (effectName) {
      case 'chrome':
        newFilter = 'grayscale(' + (intensity / 100).toFixed(1) + ')';
        break;
      case 'sepia':
        newFilter = 'sepia(' + (intensity / 100).toFixed(1) + ')';
        break;
      case 'marvin':
        newFilter = 'invert(' + intensity + '%)';
        break;
      case 'phobos':
        newFilter = 'blur(' + Math.ceil(intensity * InitialEffect.PHOBOS / 100) + 'px)';
        break;
      case 'heat':
        newFilter = 'brightness(' + Math.ceil(intensity * InitialEffect.HEAT / 100) + ')';
        break;
      default:
        newFilter = 'none';
    }
    uploadImagePreview.style.filter = newFilter;
  }

  function changeEffect(effectName, intensity) {
    setEffectIntensity(effectName, intensity);
  }

  function onUploadCancelClick(evt) {
    closeUploadOverlay();
  }

  function onUploadOverlayEsc(evt) {
    if (window.util.isEscEvent(evt) && evt.target !== uploadComment) {
      closeUploadOverlay();
      uploadForm.reset();
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

  function initValidation() {
    uploadHashtags.pattern = '('
      + HashtagsOption.SYMBOL
      + '\\w{1,'
      + HashtagsOption.LENGTH
      + '}\\b ?){0,'
      + HashtagsOption.AMOUNT
      + '}';

    uploadComment.addEventListener('invalid', function (evt) {
      if (uploadComment.validity.valueMissing) {
        validationMessage = 'Комментарий необходимо заполнить';
      } else if (uploadComment.validity.tooShort) {
        validationMessage = 'Комментарий должен быть не меньше '
          + uploadComment.minLength
          + ' символов';
      } else if (uploadComment.validity.tooLong) {
        validationMessage = 'Комментарий должен быть не больше '
          + uploadComment.maxLength
          + ' символов';
      } else {
        validationMessage = '';
      }
      uploadComment.setCustomValidity(validationMessage);
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
        var result = {};
        for (var i = 0; i < hashTags.length; i++) {
          if (result[hashTags[i]]) {
            validationMessage = 'Хэштеги не должны повторяться';
            break;
          } else {
            result[hashTags[i]] = 1;
            validationMessage = '';
          }
        }
        uploadHashtags.setCustomValidity(validationMessage);
      }
    });
  }

  function onUploadPhoto(evt) {
    showEditForm();
    initUploadClose();

    window.initScale(scaleElem, setNewSize);

    window.initEffects(changeEffect);

    initValidation();
  }

  uploadFile.addEventListener('change', onUploadPhoto);

  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    uploadSubmit.disabled = true;

    window.backend.save(
        new FormData(uploadForm),
        function (data) {
          window.showMessage('Данные загружены успешно', 'success');
          closeUploadOverlay();
          uploadForm.reset();
          uploadSubmit.disabled = false;
        },
        function (message) {
          window.showMessage(message, 'error');
        }
    );
  });
})();
