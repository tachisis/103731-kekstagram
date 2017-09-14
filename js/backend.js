'use strict';

(function () {
  var SERVER_URL = 'https://1510.dump.academy/kekstagram';
  var SUCCESS_STATUS = 200;
  var TIMEOUT = 10000;

  function setupXHR(onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
        onSuccess(xhr.response);
      } else {
        onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    return xhr;
  }

  window.backend = {
    load: function (onSuccess, onError) {
      var xhr = setupXHR(onSuccess, onError);

      xhr.open('GET', SERVER_URL + '/data');
      xhr.send();
    },

    save: function (data, onSuccess, onError) {
      var xhr = setupXHR(onSuccess, onError);

      xhr.open('POST', SERVER_URL);
      xhr.send(data);
    }
  };
})();
