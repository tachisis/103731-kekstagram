'use strict';

(function () {
  var DEFAULT_LEVEL = 100;
  var uploadEffectLevel = null;
  var uploadEffectLevelPin = null;
  var uploadEffectLevelVal = null;
  var effectLevelWidth = null;
  var shift = null;
  var effectLevelPinLeft = null;
  var effectLevelLineLeft = null;
  var changeEffect = null;
  var uploadEffectLevelInput = null;

  function setLevel(newLeft) {
    uploadEffectLevelPin.style = 'left:' + newLeft + '%;';
    uploadEffectLevelVal.style = 'width:' + newLeft + '%;';
    uploadEffectLevelInput.value = newLeft + '%';
  }

  function onMouseMove(moveEvt) {
    moveEvt.preventDefault();

    var newLeft = moveEvt.pageX - effectLevelLineLeft - shift;

    newLeft = newLeft < 0 ? 0 : newLeft;
    newLeft = newLeft > effectLevelWidth ? effectLevelWidth : newLeft;

    newLeft = (newLeft * 100 / effectLevelWidth).toFixed(1);

    setLevel(newLeft);

    if (typeof changeEffect === 'function') {
      changeEffect(newLeft);
    }
  }

  function onMouseUp(upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  function setSlider(evt) {
    evt.preventDefault();

    var effectLevelLine = uploadEffectLevel.querySelector('.upload-effect-level-line');
    effectLevelLineLeft = effectLevelLine.getBoundingClientRect().left + pageXOffset;
    effectLevelPinLeft = uploadEffectLevelPin.getBoundingClientRect().left + pageXOffset;
    shift = evt.pageX - effectLevelPinLeft - uploadEffectLevelPin.offsetWidth / 2;

    effectLevelWidth = effectLevelLine.offsetWidth;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  window.slider = {
    init: function (effectCtrls, callback) {
      uploadEffectLevel = effectCtrls.querySelector('.upload-effect-level');
      uploadEffectLevelPin = effectCtrls.querySelector('.upload-effect-level-pin');
      uploadEffectLevelVal = effectCtrls.querySelector('.upload-effect-level-val');

      changeEffect = callback;

      uploadEffectLevelPin.addEventListener('mousedown', setSlider);
    },

    clear: function (effectCtrls) {
      uploadEffectLevel = effectCtrls.querySelector('.upload-effect-level');
      uploadEffectLevelPin = effectCtrls.querySelector('.upload-effect-level-pin');
      uploadEffectLevelVal = effectCtrls.querySelector('.upload-effect-level-val');
      uploadEffectLevelInput = effectCtrls.querySelector('#effect-level');

      setLevel(DEFAULT_LEVEL);
    }
  };
})();
