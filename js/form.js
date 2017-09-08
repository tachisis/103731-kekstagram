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
  var uploadEffectLevel = uploadForm.querySelector('.upload-effect-level');
  var uploadEffectLevelPin = uploadEffectLevel.querySelector('.upload-effect-level-pin');
  var uploadEffectLevelVal = uploadEffectLevel.querySelector('.upload-effect-level-val');

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

  function setEffectLevel(newLeft) {
    uploadEffectLevelPin.style = 'left:' + newLeft + 'px;';
    uploadEffectLevelVal.style = 'width:' + newLeft + 'px;';
  }

  function setEffectIntensity(newLeft, effectName, effectLevelWidth) {
    if (effectName === 'chrome') {
      uploadImagePreview.style = 'filter:grayscale(' + (newLeft / effectLevelWidth).toFixed(1) + ')';
    }
    if (effectName === 'sepia') {
      uploadImagePreview.style = 'filter:sepia(' + (newLeft / effectLevelWidth).toFixed(1) + ')';
    }
    if (effectName === 'marvin') {
      uploadImagePreview.style = 'filter:invert(' + Math.ceil(newLeft * 100 / effectLevelWidth) + '%)';
    }
    if (effectName === 'phobos') {
      uploadImagePreview.style = 'filter:blur(' + Math.ceil(Math.ceil(newLeft * 100 / effectLevelWidth) * InitialEffect.PHOBOS / 100) + 'px)';
    }
    if (effectName === 'heat') {
      uploadImagePreview.style = 'filter:brightness(' + Math.ceil(Math.ceil(newLeft * 100 / effectLevelWidth) * InitialEffect.HEAT / 100) + ')';
    }
  }

  function updateEffectLevel(evt, effectName, effectLevelWidth) {
    evt.preventDefault();

    var startLeft = evt.clientX;

    function onMouseMove(moveEvt) {
      evt.preventDefault();

      var shift = startLeft - moveEvt.clientX;
      startLeft = moveEvt.clientX;

      var newLeft = uploadEffectLevelPin.offsetLeft - shift;

      newLeft = newLeft < 0 ? 0 : newLeft;
      newLeft = newLeft > effectLevelWidth ? effectLevelWidth : newLeft;

      setEffectLevel(newLeft);
      setEffectIntensity(newLeft, effectName, effectLevelWidth);
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
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
      uploadImagePreview.removeAttribute('style');

      var effectName = evt.target.value;

      if (effectName !== 'none') {
        uploadEffectLevel.classList.remove('hidden');

        var effectLevelWidth = uploadEffectLevel.querySelector('.upload-effect-level-line').offsetWidth;
        setEffectLevel(effectLevelWidth);

        uploadEffectLevelPin.addEventListener('mousedown', function (mdEvt) {
          updateEffectLevel(mdEvt, effectName, effectLevelWidth);
        });
      } else {
        uploadEffectLevel.classList.add('hidden');
      }
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
