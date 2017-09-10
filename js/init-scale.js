'use strict';

(function () {
  var ResizeOption = {
    DEFAULT: 100,
    STEP: 25,
    MIN: 25,
    MAX: 100
  };

  function resizeInc(uploadResizeValue, setNewSize) {
    var initialSize = parseInt(uploadResizeValue.getAttribute('value'), 10);
    var newSize = initialSize + ResizeOption.STEP;
    if (typeof setNewSize === 'function') {
      setNewSize(newSize);
    }
  }

  function resizeDec(uploadResizeValue, setNewSize) {
    var initialSize = parseInt(uploadResizeValue.getAttribute('value'), 10);
    var newSize = initialSize - ResizeOption.STEP;
    if (typeof setNewSize === 'function') {
      setNewSize(newSize);
    }
  }

  function onResizeIncClick(evt, uploadResizeValue, setNewSize) {
    resizeInc(uploadResizeValue, setNewSize);
  }

  function onResizeDecClick(evt, uploadResizeValue, setNewSize) {
    resizeDec(uploadResizeValue, setNewSize);
  }

  window.initScale = function (scaleElem, setNewSize) {
    var uploadResizeValue = scaleElem.querySelector('.upload-resize-controls-value');
    var uploadResizeInc = scaleElem.querySelector('.upload-resize-controls-button-inc');
    var uploadResizeDec = scaleElem.querySelector('.upload-resize-controls-button-dec');

    uploadResizeInc.addEventListener('click', function (evt) {
      onResizeIncClick(evt, uploadResizeValue, setNewSize);
    });
    uploadResizeDec.addEventListener('click', function (evt) {
      onResizeDecClick(evt, uploadResizeValue, setNewSize);
    });
  };
})();
