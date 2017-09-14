'use strict';

(function () {
  var DEFAULT_LEVEL = 100;
  var currentLevel = null;
  var currentEffect = 'none';

  function onEffectsClick(effectName, effectCtrls, changeEffect) {
    currentEffect = effectName;
    currentLevel = DEFAULT_LEVEL;
    window.slider.clear(effectCtrls);

    var uploadEffectLevel = effectCtrls.querySelector('.upload-effect-level');

    if (effectName !== 'none') {
      uploadEffectLevel.classList.remove('hidden');
    } else {
      uploadEffectLevel.classList.add('hidden');
    }

    if (typeof changeEffect === 'function') {
      changeEffect(currentEffect, currentLevel);
    }
  }

  window.initEffects = function (effectCtrls, changeEffect) {
    effectCtrls.addEventListener('click', function (evt) {
      if (evt.target.tagName === 'INPUT') {
        var effectName = evt.target.value;
        onEffectsClick(effectName, effectCtrls, changeEffect);
      }
    });

    window.slider.init(effectCtrls, function (newLevel) {
      currentLevel = newLevel;
      if (typeof changeEffect === 'function') {
        changeEffect(currentEffect, currentLevel);
      }
    });
  };
})();
