'use strict';

(function () {
  function destroyMessage() {
    var messageContainer = document.querySelector('body').querySelector('.info-message');
    console.log(messageContainer);
  }

  setTimeout(destroyMessage, 1000);

  function createMessageContainer(message, type) {
    var messageContainer = document.createElement('div');
    messageContainer.classList.add('info-message');
    messageContainer.classList.add(type);
    messageContainer.textContent = message;
    document.querySelector('body').appendChild(messageContainer);

    destroyMessage();
  }

  window.infoMessage = function (message, type) {
    createMessageContainer(message, type);
  }
})();
