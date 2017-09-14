'use strict';

(function () {
  function destroyMessage() {
    var messageContainer = document.querySelector('body').querySelector('.info-message');
    document.body.removeChild(messageContainer);
  }

  function createMessageContainer(message, type) {
    var messageContainer = document.createElement('div');
    messageContainer.classList.add('info-message');
    messageContainer.classList.add('_' + type);
    messageContainer.textContent = message;
    document.body.appendChild(messageContainer);

    setTimeout(destroyMessage, 4000);
  }

  window.infoMessage = function (message, type) {
    createMessageContainer(message, type);
  }
})();
