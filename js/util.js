'use strict';

(function () {
  window.util = {
    KeyCode: {
      ESC: 27,
      ENTER: 13,
      SPACE: 32
    },
    getRandom: function (min, max) {
      return Math.random() * (max - min) + min;
    },
    shuffle: function (array) {
      var current = array.length;
      var tmp;
      var random;

      while (current--) {
        random = Math.floor(Math.random() * current);
        tmp = array[current];
        array[current] = array[random];
        array[random] = tmp;
      }

      return array;
    },
    isActivationEvent: function (evt) {
      return evt.keyCode === window.util.KeyCode.ENTER || evt.keyCode === window.util.KeyCode.SPACE;
    }
  };
})();
