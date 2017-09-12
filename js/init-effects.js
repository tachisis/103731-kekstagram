'use strict';

(function () {
  var changeEffect = null;
  var currentLevel = null;
  var currentEffect = 'none';

  function onEffectsClick(evt, effectCtrls, onChange) {
    if (evt.target.tagName === 'INPUT') {
      var effectName = evt.target.value;

      if (typeof onChange === 'function') {
        currentEffect = effectName;
        currentLevel = 100;
        window.initSlider.clear(effectCtrls);
        onChange(currentEffect, currentLevel);
      }
    }
  }

  window.initEffects = function (effectCtrls, callback) {
    changeEffect = callback;

    effectCtrls.addEventListener('click', function (evt) {
      onEffectsClick(evt, effectCtrls, changeEffect);
    });

    window.initSlider.init(effectCtrls, function (newLevel) {
      currentLevel = newLevel;
      if (typeof changeEffect === 'function') {
        changeEffect(currentEffect, currentLevel);
      }
    });
  };
})();
