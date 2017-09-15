'use strict';

(function () {
  var DEFAULT_LEVEL = 100;
  var currentLevel = null;
  var currentEffect = 'none';
  var uploadForm = document.querySelector('#upload-select-image');
  var uploadEffectLevel = uploadForm.querySelector('.upload-effect-level');
  var effectCtrls = uploadForm.querySelector('.upload-effect-controls');

  function changeEffect(effectName, onEffectChange) {
    currentEffect = effectName;
    currentLevel = DEFAULT_LEVEL;
    window.slider.clear(effectCtrls);

    if (effectName !== 'none') {
      uploadEffectLevel.classList.remove('hidden');
    } else {
      uploadEffectLevel.classList.add('hidden');
    }

    if (typeof onEffectChange === 'function') {
      onEffectChange(currentEffect, currentLevel);
    }
  }

  window.initEffects = function (onEffectChange) {
    effectCtrls.addEventListener('click', function (evt) {
      if (evt.target.tagName === 'INPUT') {
        var effectName = evt.target.value;
        changeEffect(effectName, onEffectChange);
      }
    });

    window.slider.init(effectCtrls, function (newLevel) {
      currentLevel = newLevel;
      if (typeof onEffectChange === 'function') {
        onEffectChange(currentEffect, currentLevel);
      }
    });
  };
})();
