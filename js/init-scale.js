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
    uploadResizeInc.disabled = newSize === ResizeOption.MAX;
    uploadResizeDec.disabled = newSize === ResizeOption.MIN;
  }

  function resizeInc(onSizeChange) {
    var newSize = window.util.clamp(parseInt(uploadResizeValue.value, 10) + ResizeOption.STEP, ResizeOption.MIN, ResizeOption.MAX);

    updateResizeBtnState(newSize);

    if (typeof onSizeChange === 'function') {
      onSizeChange(newSize);
    }
  }

  function resizeDec(onSizeChange) {
    var newSize = window.util.clamp(parseInt(uploadResizeValue.value, 10) - ResizeOption.STEP, ResizeOption.MIN, ResizeOption.MAX);

    updateResizeBtnState(newSize);

    if (typeof onSizeChange === 'function') {
      onSizeChange(newSize);
    }
  }

  window.initScale = function (scaleElem, setNewSize) {
    uploadResizeValue = scaleElem.querySelector('.upload-resize-controls-value');
    uploadResizeInc = scaleElem.querySelector('.upload-resize-controls-button-inc');
    uploadResizeDec = scaleElem.querySelector('.upload-resize-controls-button-dec');

    updateResizeBtnState(parseInt(uploadResizeValue.value, 10));

    uploadResizeInc.addEventListener('click', function (evt) {
      resizeInc(setNewSize);
    });
    uploadResizeDec.addEventListener('click', function (evt) {
      resizeDec(setNewSize);
    });
  };
})();
