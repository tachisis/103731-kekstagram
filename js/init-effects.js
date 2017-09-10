'use strict';

(function () {
  function onEffectsClick(evt, effectCtrls, changeEffect) {
    if (evt.target.tagName === 'INPUT') {
      var effectName = evt.target.value;

      if (typeof changeEffect === 'function') {
        changeEffect(effectName);
      }
    }
  }

  window.initEffects = function (effectCtrls, changeEffect) {
    effectCtrls.addEventListener('click', function (evt) {
      onEffectsClick(evt, effectCtrls, changeEffect);
    });
  };
})();
