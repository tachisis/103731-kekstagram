'use strict';

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var photoTemplate = document
    .querySelector('#picture-template')
    .content
    .querySelector('.picture');

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function shuffle(array) {
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
}

function getUrls(count) {
  var urls = [];

  for (var i = 0; i < count; i++) {
    urls[i] = 'photos/' + (i + 1) + '.jpg';
  }

  return urls;
}

function getRandomComments(comments) {
  var shuffledComments = shuffle(comments);
  var randomCount = Math.round(getRandom(1, 2));

  comments = [];

  for (var i = 0; i < randomCount; i++) {
    comments[i] = shuffledComments[i];
  }

  return comments;
}

function getPhotos(comments, count) {
  var photos = [];
  var urls = shuffle(getUrls(count));

  for (var i = 0; i < count; i++) {
    photos[i] = {
      url: urls[i],
      likes: Math.round(getRandom(15, 200)),
      comments: getRandomComments(comments)
    };
  }

  return photos;
}

function getPhotoElement(photos) {
  var photo = photoTemplate.cloneNode(true);

  photo.querySelector('.picture > img').src = photos.url;
  photo.querySelector('.picture-likes').textContent = photos.likes;
  photo.querySelector('.picture-comments').textContent = photos.comments.length;

  return photo;
}

function renderPhotos(photos, target) {
  var photosListElement = document.querySelector(target);
  var fragment = document.createDocumentFragment();
  var count = photos.length;

  for (var i = 0; i < count; i++) {
    fragment.appendChild(getPhotoElement(photos[i]));
  }

  photosListElement.appendChild(fragment);
}

function showPhotoOverlay(photo) {
  var photoOverlay = document.querySelector('.gallery-overlay');
  photoOverlay.querySelector('.gallery-overlay-image').src = photo.url;
  photoOverlay.querySelector('.likes-count').textContent = photo.likes;
  photoOverlay.querySelector('.comments-count').textContent = photo.comments.length;
  photoOverlay.classList.remove('hidden');
}

var photos = getPhotos(COMMENTS, 25);
renderPhotos(photos, '.pictures');

document.querySelector('.upload-overlay').classList.add('hidden');
showPhotoOverlay(photos[0]);
