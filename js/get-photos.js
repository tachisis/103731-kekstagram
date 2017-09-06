'use strict';

(function () {
  var COMMENTS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  function getRandomComments(comments) {
    var shuffledComments = window.util.shuffle(comments);
    var randomCount = Math.round(window.util.getRandom(1, 2));

    comments = [];

    for (var i = 0; i < randomCount; i++) {
      comments[i] = shuffledComments[i];
    }

    return comments;
  }

  window.getPhotos = function (count) {
    var photos = [];

    for (var i = 0; i < count; i++) {
      photos[i] = {
        url: 'photos/' + (i + 1) + '.jpg',
        likes: Math.round(window.util.getRandom(15, 200)),
        comments: getRandomComments(COMMENTS)
      };
    }

    return window.util.shuffle(photos);
  };
})();
