'use strict';

(function () {
  var uploadEffectLevel = null;
  var uploadEffectLevelPin = null;
  var startLeft = null;
  var effectLevelWidth = null;
  var setEffectLevel = null;

  function onMouseMove(moveEvt) {
    moveEvt.preventDefault();

    var shift = startLeft - moveEvt.clientX;
    startLeft = moveEvt.clientX;

    var newLeft = uploadEffectLevelPin.offsetLeft - shift;

    newLeft = newLeft < 0 ? 0 : newLeft;
    newLeft = newLeft > effectLevelWidth ? effectLevelWidth : newLeft;

    if (typeof setEffectLevel === 'function') {
      setEffectLevel(newLeft, effectLevelWidth);
    }
  }

  function onMouseUp(upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  function setSlider(evt) {
    evt.preventDefault();

    startLeft = evt.clientX;
    effectLevelWidth = uploadEffectLevel.querySelector('.upload-effect-level-line').offsetWidth;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  window.initSlider = function (effectCtrls, callback) {
    uploadEffectLevel = effectCtrls.querySelector('.upload-effect-level');
    uploadEffectLevelPin = effectCtrls.querySelector('.upload-effect-level-pin');
    setEffectLevel = callback;

    uploadEffectLevelPin.addEventListener('mousedown', setSlider);
  };
})();
