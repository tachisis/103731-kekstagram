'use strict';

(function () {
  var dataCopy = null;

  function onFiltersClick(filterName, data, renderPhotos) {
    switch (filterName) {
      case 'recommend':
        renderPhotos(data);
        break;
      case 'popular':
        dataCopy = data.slice();
        dataCopy.sort(function (first, second) {
          if (first.likes < second.likes) {
            return 1;
          } else if (first.likes > second.likes) {
            return -1;
          } else {
            return 0;
          }
        });
        renderPhotos(dataCopy);
        break;
      case 'discussed':
        dataCopy = data.slice();
        dataCopy.sort(function (first, second) {
          if (first.comments.length < second.comments.length) {
            return 1;
          } else if (first.comments.length > second.comments.length) {
            return -1;
          } else {
            return 0;
          }
        });
        renderPhotos(dataCopy);
        break;
      case 'random':
        renderPhotos(window.util.shuffle(data.slice()));
        break;
      default:
        renderPhotos(data);
    }
  }

  window.initFilters = function (filters, data, renderPhotos) {
    filters.classList.remove('hidden');

    filters.addEventListener('click', function (evt) {
      if (evt.target.tagName === 'INPUT') {
        var filterName = evt.target.value;
        onFiltersClick(filterName, data, renderPhotos);
      }
    });

    if (typeof renderPhotos === 'function') {
      renderPhotos(data);
    }
  };
})();
