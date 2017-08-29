'use strict';

var KEYCODES = {
  esc: 27,
  enter: 13,
  space: 32
};

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

var photoOverlay = document.querySelector('.gallery-overlay');
var photoOverlayClose = photoOverlay.querySelector('.gallery-overlay-close');

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

  for (var i = 0; i < count; i++) {
    photos[i] = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: Math.round(getRandom(15, 200)),
      comments: getRandomComments(comments)
    };
  }

  return shuffle(photos);
}

var openedPhoto = null;

function closeHandler(evt) {
  if (evt.type === 'keydown' && (evt.keycode === KEYCODES.space || evt.keycode === KEYCODES.enter)) {
    photoOverlay.classList.add('hidden');

    var pictures = document.querySelectorAll('.picture');
    pictures[openedPhoto].focus();

    photoOverlayClose.removeEventListener('keydown', closeHandler);
  } else {
    photoOverlay.classList.add('hidden');

    var pictures = document.querySelectorAll('.picture');
    pictures[openedPhoto].focus();

    photoOverlayClose.removeEventListener('click', closeHandler);
  }

  photoOverlayClose.removeEventListener('keydown', closeHandler);
  openedPhoto = null;
}

function addPhotoOpenHandlers(elem, i, photos) {
  elem.addEventListener('click', function (evt) {
    evt.preventDefault();
    openedPhoto = i;
    photoOverlayClose.addEventListener('click', closeHandler);
    photoOverlayClose.addEventListener('keydown', closeHandler);
    document.addEventListener('keydown', addPhotoEscHandler);
    openPhoto(photos, i);
  });

  elem.addEventListener('keydown', function (evt) {
    if (evt.keyCode === KEYCODES.enter || evt.keyCode === KEYCODES.space) {
      evt.preventDefault();
      openedPhoto = i;
      photoOverlayClose.addEventListener('click', closeHandler);
      photoOverlayClose.addEventListener('keydown', closeHandler);
      document.addEventListener('keydown', addPhotoEscHandler);
      openPhoto(photos, i);
    }
  });
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
    var photoElem = getPhotoElement(photos[i]);
    addPhotoOpenHandlers(photoElem, i, photos);
    fragment.appendChild(photoElem);
  }

  photosListElement.appendChild(fragment);
}

function fillPhoto(photo, target) {
  target.querySelector('.gallery-overlay-image').src = photo.url;
  target.querySelector('.likes-count').textContent = photo.likes;
  target.querySelector('.comments-count').textContent = photo.comments.length;
}

function addPhotoEscHandler(evt) {
  if (evt.keyCode === KEYCODES.esc) {
    evt.preventDefault();
    closeHandler(evt);
    document.removeEventListener('keycode', addPhotoEscHandler);
  }
}

function openPhoto(photos, item) {
  var photo = photos[item];

  fillPhoto(photo, photoOverlay);

  photoOverlay.classList.remove('hidden');
  photoOverlay.focus();
}

var photos = getPhotos(COMMENTS, 25);
renderPhotos(photos, '.pictures');

document.querySelector('.upload-overlay').classList.add('hidden');
