'use strict';

(function () {
  var DESTROY_TIMEOUT = 4000;

  function destroyMessage() {
    var messageContainer = document.querySelector('.info-message');
    document.body.removeChild(messageContainer);
  }

  function createMessageContainer(message, type) {
    var messageContainer = document.createElement('div');
    messageContainer.classList.add('info-message');
    messageContainer.classList.add('_' + type);
    messageContainer.textContent = message;
    document.body.appendChild(messageContainer);

    setTimeout(destroyMessage, DESTROY_TIMEOUT);
  }

  window.showMessage = function (message, type) {
    createMessageContainer(message, type);
  };
})();
