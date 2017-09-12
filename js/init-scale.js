'use strict';

(function () {
  var ResizeOption = {
    DEFAULT: 100,
    STEP: 25,
    MIN: 25,
    MAX: 100
  };

  var uploadResizeValue = null;
  var uploadResizeInc = null;
  var uploadResizeDec = null;

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

  function resizeInc(setNewSize) {
    var initialSize = parseInt(uploadResizeValue.getAttribute('value'), 10);
    var newSize = initialSize + ResizeOption.STEP;
    if (typeof setNewSize === 'function') {
      if (newSize <= ResizeOption.MAX && newSize >= ResizeOption.MIN) {
        setNewSize(newSize);
      }
      updateResizeBtnState(newSize);
    }
  }

  function resizeDec(setNewSize) {
    var initialSize = parseInt(uploadResizeValue.getAttribute('value'), 10);
    var newSize = initialSize - ResizeOption.STEP;
    if (typeof setNewSize === 'function') {
      if (newSize <= ResizeOption.MAX && newSize >= ResizeOption.MIN) {
        setNewSize(newSize);
      }
      updateResizeBtnState(newSize);
    }
  }

  window.initScale = function (scaleElem, setNewSize) {
    uploadResizeValue = scaleElem.querySelector('.upload-resize-controls-value');
    uploadResizeInc = scaleElem.querySelector('.upload-resize-controls-button-inc');
    uploadResizeDec = scaleElem.querySelector('.upload-resize-controls-button-dec');

    updateResizeBtnState(parseInt(uploadResizeValue.getAttribute('value'), 10));

    uploadResizeInc.addEventListener('click', function (evt) {
      resizeInc(setNewSize);
    });
    uploadResizeDec.addEventListener('click', function (evt) {
      resizeDec(setNewSize);
    });
  };
})();
