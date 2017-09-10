'use strict';

(function () {
  var uploadForm = document.querySelector('#upload-select-image');
  var uploadFile = uploadForm.querySelector('#upload-file');
  var uploadImage = uploadForm.querySelector('.upload-image');
  var uploadOverlay = uploadForm.querySelector('.upload-overlay');
  var uploadCancel = uploadForm.querySelector('.upload-form-cancel');
  var uploadComment = uploadForm.querySelector('.upload-form-description');
  var scaleElem = uploadForm.querySelector('.upload-resize-controls');
  var uploadResizeValue = uploadForm.querySelector('.upload-resize-controls-value');
  var uploadResizeInc = uploadForm.querySelector('.upload-resize-controls-button-inc');
  var uploadResizeDec = uploadForm.querySelector('.upload-resize-controls-button-dec');
  var effectCtrls = uploadForm.querySelector('.upload-effect-controls');
  var uploadImagePreview = uploadForm.querySelector('.effect-image-preview');
  var uploadHashtags = uploadForm.querySelector('.upload-form-hashtags');
  var uploadEffectLevel = uploadForm.querySelector('.upload-effect-level');
  var uploadEffectLevelPin = uploadEffectLevel.querySelector('.upload-effect-level-pin');
  var uploadEffectLevelVal = uploadEffectLevel.querySelector('.upload-effect-level-val');

  var effectClass = null;
  var effectLevelWidth = null;
  var newEffectName = null;

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

  var InitialEffect = {
    CHROME: 1,
    SEPIA: 1,
    MARVIN: 100,
    PHOBOS: 3,
    HEAT: 3
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

  function setEffectLevel(newLeft, newLevelWidth) {
    uploadEffectLevelPin.style = 'left:' + newLeft + 'px;';
    uploadEffectLevelVal.style = 'width:' + newLeft + 'px;';

    if (typeof newLevelWidth !== 'undefined') {
      setEffectIntensity(newLeft, newEffectName, newLevelWidth);
    }
  }

  function setEffectIntensity(newLeft, effectName, newLevelWidth) {
    if (effectName === 'chrome') {
      uploadImagePreview.style = 'filter:grayscale(' + (newLeft / newLevelWidth).toFixed(1) + ')';
    }
    if (effectName === 'sepia') {
      uploadImagePreview.style = 'filter:sepia(' + (newLeft / newLevelWidth).toFixed(1) + ')';
    }
    if (effectName === 'marvin') {
      uploadImagePreview.style = 'filter:invert(' + Math.ceil(newLeft * 100 / newLevelWidth) + '%)';
    }
    if (effectName === 'phobos') {
      uploadImagePreview.style = 'filter:blur(' + Math.ceil(Math.ceil(newLeft * 100 / newLevelWidth) * InitialEffect.PHOBOS / 100) + 'px)';
    }
    if (effectName === 'heat') {
      uploadImagePreview.style = 'filter:brightness(' + Math.ceil(Math.ceil(newLeft * 100 / newLevelWidth) * InitialEffect.HEAT / 100) + ')';
    }
  }

  function changeEffect(effectName) {
    newEffectName = effectName;

    uploadImagePreview.classList.remove(effectClass);
    effectClass = 'effect-' + effectName;
    uploadImagePreview.classList.add(effectClass);
    uploadImagePreview.removeAttribute('style');

    if (effectName !== 'none') {
      uploadEffectLevel.classList.remove('hidden');
      setEffectLevel(effectLevelWidth);
    } else {
      uploadEffectLevel.classList.add('hidden');
    }
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

  function showEditForm() {
    uploadImage.classList.toggle('hidden');
    uploadOverlay.classList.toggle('hidden');
  }

  function initUploadClose() {
    document.addEventListener('keydown', onUploadOverlayEsc);
    uploadCancel.addEventListener('click', onUploadCancelClick);
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

    updateResizeBtnState(parseInt(uploadResizeValue.getAttribute('value'), 10));
    window.initScale(scaleElem, setNewSize);

    window.initEffects(effectCtrls, changeEffect);
    window.initSlider(effectCtrls, setEffectLevel);

    initValidation();
  }

  uploadFile.addEventListener('change', onUploadPhoto);
})();
