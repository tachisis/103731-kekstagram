'use strict';

(function () {
  var uploadForm = document.querySelector('#upload-select-image');
  var effectCtrls = uploadForm.querySelector('.upload-effect-controls');

  var uploadEffectLevel = null;
  var uploadEffectLevelPin = null;
  var uploadEffectLevelVal = null;
  var effectLevelWidth = null;
  var setEffectLevel = null;
  var effectLevelpinLeft = null;
  var effectLevelLineLeft = null;
  var shift = null;

  function onMouseMove(moveEvt) {
    moveEvt.preventDefault();

    var newLeft = moveEvt.pageX - effectLevelLineLeft - shift;

    newLeft = newLeft < 0 ? 0 : newLeft;
    newLeft = newLeft > effectLevelWidth ? effectLevelWidth : newLeft;

    uploadEffectLevelPin.style = 'left:' + newLeft + 'px;';
    uploadEffectLevelVal.style = 'width:' + newLeft + 'px;';
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
    effectLevelpinLeft = uploadEffectLevelPin.getBoundingClientRect().left + pageXOffset;
    shift = evt.pageX - effectLevelpinLeft;

    effectLevelWidth = effectLevelLine.offsetWidth;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function onEffectsClick(evt, effectCtrls, changeEffect) {
    if (evt.target.tagName === 'INPUT') {
      var effectName = evt.target.value;

      if (typeof changeEffect === 'function') {
        changeEffect(effectName);
      }
    }
  }

  function initSlider(effectCtrls) {
    uploadEffectLevel = effectCtrls.querySelector('.upload-effect-level');
    uploadEffectLevelPin = effectCtrls.querySelector('.upload-effect-level-pin');
    uploadEffectLevelVal = effectCtrls.querySelector('.upload-effect-level-val');

    uploadEffectLevelPin.addEventListener('mousedown', setSlider);
  }

  initSlider(effectCtrls);

  window.initEffects = function (effectCtrls, changeEffect) {
    effectCtrls.addEventListener('click', function (evt) {
      onEffectsClick(evt, effectCtrls, changeEffect);
    });
  };
})();
