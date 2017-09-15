'use strict';

(function () {
  function filter(filterName, data, onFilter) {
    var sortedData;

    switch (filterName) {
      case 'popular':
        sortedData = data.slice().sort(function (first, second) {
          return second.likes - first.likes;
        });
        break;
      case 'discussed':
        sortedData = data.slice().sort(function (first, second) {
          return second.comments.length - first.comments.length;
        });
        break;
      case 'random':
        sortedData = window.util.shuffle(data.slice());
        break;
      default:
        sortedData = data;
    }

    if (typeof onFilter === 'function') {
      onFilter(sortedData);
    }
  }

  window.initFilters = function (filters, data, onFilter) {
    filters.classList.remove('hidden');

    filters.addEventListener('click', function (evt) {
      if (evt.target.tagName === 'INPUT') {
        filter(evt.target.value, data, onFilter);
      }
    });

    filter(filters.querySelector(':checked').value, data, onFilter);
  };
})();
