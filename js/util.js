'use strict';

(function () {
  var KeyCode = {
    ESC: 27,
    ENTER: 13,
    SPACE: 32
  };

  window.util = {
    getRandom: function (min, max) {
      return Math.random() * (max - min) + min;
    },

    swapArrayItems: function (array, current, random) {
      var tmp = array[current];
      array[current] = array[random];
      array[random] = tmp;
    },

    shuffle: function (array) {
      var current = array.length;

      while (current--) {
        var random = Math.floor(Math.random() * current);
        window.util.swapArrayItems(array, current, random);
      }

      return array;
    },

    isActivationEvent: function (evt) {
      return evt.keyCode === KeyCode.ENTER || evt.keyCode === KeyCode.SPACE;
    },

    isEscEvent: function (evt) {
      return evt.keyCode === KeyCode.ESC;
    }
  };
})();
