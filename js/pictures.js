'use strict';

var KeyCode = {
  ESC: 27,
  ENTER: 13,
  SPACE: 32
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

function isActivationEvent(evt) {
  return evt.keyCode === KeyCode.ENTER || evt.keyCode === KeyCode.SPACE;
}

function onCloseButtonKeydown(evt) {
  if (isActivationEvent(evt)) {
    evt.preventDefault();
    closePhoto(evt);
  }
}

function onCloseButtonClick(evt) {
  evt.preventDefault();
  closePhoto(evt);
}

function onPhotoOverlayEsc(evt) {
  if (evt.keyCode === KeyCode.ESC) {
    evt.preventDefault();
    closePhoto(evt);
  }
}

function closePhoto() {
  photoOverlay.classList.add('hidden');

  var pictures = document.querySelectorAll('.picture');
  pictures[openedPhoto].focus();

  photoOverlayClose.removeEventListener('click', onCloseButtonClick);
  photoOverlayClose.removeEventListener('keydown', onCloseButtonKeydown);
  document.removeEventListener('keycode', onPhotoOverlayEsc);

  openedPhoto = null;
}

function addPhotoOpenHandlers(elem, i, photos) {
  elem.addEventListener('click', function (evt) {
    evt.preventDefault();
    openPhoto(photos, i);
  });

  elem.addEventListener('keydown', function (evt) {
    if (isActivationEvent(evt)) {
      evt.preventDefault();
      openPhoto(photos, i);
    }
  });
}

function fillPhoto(photo, target) {
  target.querySelector('.gallery-overlay-image').src = photo.url;
  target.querySelector('.likes-count').textContent = photo.likes;
  target.querySelector('.comments-count').textContent = photo.comments.length;
}

function openPhoto(photos, item) {
  openedPhoto = item;

  fillPhoto(photos[item], photoOverlay);

  photoOverlay.classList.remove('hidden');
  photoOverlay.focus();

  photoOverlayClose.addEventListener('click', onCloseButtonClick);
  photoOverlayClose.addEventListener('keydown', onCloseButtonKeydown);
  document.addEventListener('keydown', onPhotoOverlayEsc);
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

var photos = getPhotos(COMMENTS, 25);
renderPhotos(photos, '.pictures');

var uploadForm = document.querySelector('#upload-select-image');
var uploadFile = uploadForm.querySelector('#upload-file');
var uploadImage = uploadForm.querySelector('.upload-image');
var uploadOverlay = uploadForm.querySelector('.upload-overlay');
var uploadCancel = uploadForm.querySelector('.upload-form-cancel');
var uploadComment = uploadForm.querySelector('.upload-form-description');
var uploadResizeValue = uploadForm.querySelector('.upload-resize-controls-value');
var uploadResizeInc = uploadForm.querySelector('.upload-resize-controls-button-inc');
var uploadResizeDec = uploadForm.querySelector('.upload-resize-controls-button-dec');
var uploadEffects = uploadForm.querySelector('.upload-effect-controls');
var uploadImagePreview = uploadForm.querySelector('.effect-image-preview');
var uploadHashtags = uploadForm.querySelector('.upload-form-hashtags');

var effectClass = null;

var HashtagsOption = {
  AMOUNT: 5,
  LENGTH: 20,
  SYMBOL: '#'
};

var ResizeOption = {
  DEFAULT: 100,
  STEP: 25,
  MIN: 25,
  MAX: 100
};

function closeUploadOverlay() {
  uploadOverlay.classList.toggle('hidden');
  uploadImage.classList.toggle('hidden');
  uploadCancel.removeEventListener('click', onUploadCancelClick);
  document.removeEventListener('keydown', onUploadOverlayEsc);
}

function toggleResizeBtnState(newSize) {
  if (uploadResizeDec.hasAttribute('disabled') && newSize >= ResizeOption.MIN) {
    uploadResizeDec.removeAttribute('disabled');
  }
  if (uploadResizeInc.hasAttribute('disabled') && newSize <= ResizeOption.MAX) {
    uploadResizeInc.removeAttribute('disabled');
  }
  if (newSize === ResizeOption.MAX) {
    uploadResizeInc.setAttribute('disabled', 'disabled');
  }
  if (newSize === ResizeOption.MIN) {
    uploadResizeDec.setAttribute('disabled', 'disabled');
  }
}

function setNewSize(newSize) {
  if (newSize <= ResizeOption.MAX && newSize >= ResizeOption.MIN) {
    uploadResizeValue.setAttribute('value', newSize + '%');
    uploadImagePreview.setAttribute('style', 'transform: scale(' + newSize / 100 + ')');
    toggleResizeBtnState(newSize);
  }
}

function resizeInc() {
  var initialSize = parseInt(uploadResizeValue.getAttribute('value'), 10);
  var newSize = initialSize + ResizeOption.STEP;
  setNewSize(newSize);
}

function resizeDec() {
  var initialSize = parseInt(uploadResizeValue.getAttribute('value'), 10);
  var newSize = initialSize - ResizeOption.STEP;
  setNewSize(newSize);
}

function onUploadCancelClick(evt) {
  closeUploadOverlay(evt);
}

function onUploadOverlayEsc(evt) {
  if (evt.keyCode === KeyCode.ESC && evt.target !== uploadComment) {
    closeUploadOverlay(evt);
    uploadForm.reset();
  }
}

function onResizeIncClick(evt) {
  resizeInc();
}

function onResizeDecClick(evt) {
  resizeDec();
}

function onEffectsClick(evt) {
  if (evt.target.tagName === 'INPUT') {
    uploadImagePreview.classList.remove(effectClass);
    effectClass = 'effect-' + evt.target.value;
    uploadImagePreview.classList.add(effectClass);
  }
}

function showEditForm() {
  uploadImage.classList.toggle('hidden');
  uploadOverlay.classList.toggle('hidden');
}

function initUploadClose() {
  document.addEventListener('keydown', onUploadOverlayEsc);
  uploadCancel.addEventListener('click', onUploadCancelClick);
}

function initResize() {
  toggleResizeBtnState(parseInt(uploadResizeValue.getAttribute('value'), 10));
  uploadResizeInc.addEventListener('click', onResizeIncClick);
  uploadResizeDec.addEventListener('click', onResizeDecClick);
}

function initEffects() {
  uploadEffects.addEventListener('click', onEffectsClick);
}

function initValidation() {
  uploadHashtags.setAttribute('pattern', '('
    + HashtagsOption.SYMBOL
    + '\\w{1,'
    + HashtagsOption.LENGTH
    + '}\\b ?){0,'
    + HashtagsOption.AMOUNT
    + '}');

  uploadComment.addEventListener('invalid', function (evt) {
    if (uploadComment.validity.valueMissing) {
      uploadComment.setCustomValidity('Комментарий необходимо заполнить');
    } else if (uploadComment.validity.tooShort) {
      uploadComment.setCustomValidity('Комментарий должен быть не меньше '
        + uploadComment.getAttribute('minlength')
        + ' символов');
    } else if (uploadComment.validity.tooLong) {
      uploadComment.setCustomValidity('Комментарий должен быть не больше '
        + uploadComment.getAttribute('maxlength')
        + ' символов');
    } else {
      uploadComment.setCustomValidity('');
    }
  });

  uploadHashtags.addEventListener('invalid', function (evt) {
    if (uploadHashtags.validity.patternMismatch) {
      uploadHashtags.setCustomValidity('Хэштегов не должно быть больше '
        + HashtagsOption.AMOUNT
        + ', они должны начинаться с '
        + HashtagsOption.SYMBOL
        + ', состоять из одного слова не больше '
        + HashtagsOption.LENGTH
        + ' символов, разделяться пробелами');
    } else if (uploadHashtags.validity.customError) {
      uploadHashtags.setCustomValidity('Хэштеги не должны повторяться');
    } else {
      uploadHashtags.setCustomValidity('');
    }
  });

  uploadHashtags.addEventListener('input', function (evt) {
    var hashtagsString = uploadHashtags.value;
    if (hashtagsString.trim() !== '') {
      var hashTags = hashtagsString.split(' ');
      hashTags.sort();
      for (var i = 1; i < hashTags.length; i++) {
        if (hashTags[i] === hashTags[i - 1]) {
          uploadHashtags.setCustomValidity('Хэштеги не должны повторяться');
        } else {
          uploadHashtags.setCustomValidity('');
        }
      }
    }
  });
}

function onUploadPhoto(evt) {
  showEditForm();
  initUploadClose();
  initResize();
  initEffects();
  initValidation();
}

uploadFile.addEventListener('change', onUploadPhoto);
