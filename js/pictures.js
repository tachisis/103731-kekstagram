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
var uploadSubmit = uploadForm.querySelector('.upload-form-submit');
var uploadComment = uploadForm.querySelector('.upload-form-description');
var uploadResizeValue = uploadForm.querySelector('.upload-resize-controls-value');
var uploadResizeInc = uploadForm.querySelector('.upload-resize-controls-button-inc');
var uploadResizeDec = uploadForm.querySelector('.upload-resize-controls-button-dec');
var uploadEffects = uploadForm.querySelector('.upload-effect-controls');
var uploadEffectsInputs = uploadForm.querySelectorAll('input[name="effect"]');
var uploadImagePreview = uploadForm.querySelector('.effect-image-preview');
var uploadHashtags = uploadForm.querySelector('.upload-form-hashtags');

var focusedComment = false;
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
  uploadCancel.removeEventListener('keydown', onUploadCancelKeydown);
  document.removeEventListener('keydown', onUploadOverlayEsc);
  uploadComment.removeEventListener('focus', toggleCommentFocus);
  uploadComment.removeEventListener('blur', toggleCommentFocus);
  uploadSubmit.removeEventListener('click', onUploadSubmitClick);
  uploadSubmit.removeEventListener('keydown', onUploadSubmitKeydown);
}

function toggleCommentFocus() {
  focusedComment = !focusedComment;
}

function resizeInc() {
  var initSize = parseInt(uploadResizeValue.getAttribute('value'), 10);
  var newSize = initSize + ResizeOption.STEP;
  if (newSize <= ResizeOption.MAX) {
    uploadResizeValue.setAttribute('value', newSize + '%');
    uploadImagePreview.style.transform = 'scale(' + newSize / 100 + ')';
    if (newSize === ResizeOption.MAX) {
      uploadResizeInc.setAttribute('disabled', 'disabled');
    }
  }
  if (uploadResizeDec.hasAttribute('disabled') && newSize >= ResizeOption.MIN) {
    uploadResizeDec.removeAttribute('disabled');
  }
}

function resizeDec() {
  var initSize = parseInt(uploadResizeValue.getAttribute('value'), 10);
  var newSize = initSize - ResizeOption.STEP;
  if (newSize >= ResizeOption.MIN) {
    uploadResizeValue.setAttribute('value', newSize + '%');
    uploadImagePreview.style.transform = 'scale(' + newSize / 100 + ')';
    if (newSize === ResizeOption.MIN) {
      uploadResizeDec.setAttribute('disabled', 'disabled');
    }
  }
  if (uploadResizeInc.hasAttribute('disabled') && newSize <= ResizeOption.MAX) {
    uploadResizeInc.removeAttribute('disabled');
  }
}

function onUploadCancelKeydown(evt) {
  if (isActivationEvent(evt)) {
    evt.preventDefault();
    closeUploadOverlay(evt);
    uploadForm.reset();
  }
}

function onUploadCancelClick(evt) {
  evt.preventDefault();
  closeUploadOverlay(evt);
  uploadForm.reset();
}

function onUploadSubmitKeydown(evt) {
  if (isActivationEvent(evt)) {
    if (uploadForm.checkValidity()) {
      uploadForm.submit();
      uploadForm.reset();
    }
  }
  return false;
}

function onUploadSubmitClick(evt) {
  if (uploadForm.checkValidity()) {
    uploadForm.submit();
    uploadForm.reset();
  }
  return false;
}

function onUploadOverlayEsc(evt) {
  if (evt.keyCode === KeyCode.ESC) {
    evt.preventDefault();
    if (!focusedComment) {
      closeUploadOverlay(evt);
      uploadForm.reset();
    }
  }
}

function onResizeIncClick(evt) {
  resizeInc();
}

function onResizeIncKeydown(evt) {
  if (isActivationEvent(evt)) {
    resizeInc();
  }
}

function onResizeDecClick(evt) {
  resizeDec();
}

function onResizeDecKeydown(evt) {
  if (isActivationEvent(evt)) {
    resizeDec();
  }
}

function onEffectsClick(evt) {
  if (evt.target.tagName === 'INPUT') {
    var target = evt.target;
    for (var i = 0; i < uploadEffectsInputs.length; i++) {
      uploadEffectsInputs[i].removeAttribute('checked');
    }
    target.setAttribute('checked', 'checked');
    if (effectClass !== null) {
      uploadImagePreview.classList.remove(effectClass);
    }
    effectClass = 'effect-' + target.value;
    uploadImagePreview.classList.add(effectClass);
  }
}

function initUploadClose() {
  uploadCancel.addEventListener('click', onUploadCancelClick);
  uploadCancel.addEventListener('keydown', onUploadCancelKeydown);
  document.addEventListener('keydown', onUploadOverlayEsc);
  uploadComment.addEventListener('focus', toggleCommentFocus);
  uploadComment.addEventListener('blur', toggleCommentFocus);
}

function initUploadSubmit() {
  uploadSubmit.addEventListener('click', onUploadSubmitClick);
  uploadSubmit.addEventListener('keydown', onUploadSubmitKeydown);
}

function initResize() {
  if (uploadResizeValue.value === '100%') {
    uploadResizeInc.setAttribute('disabled', 'disabled');
  }
  uploadResizeInc.addEventListener('click', onResizeIncClick);
  uploadResizeInc.addEventListener('keydown', onResizeIncKeydown);
  uploadResizeDec.addEventListener('click', onResizeDecClick);
  uploadResizeDec.addEventListener('keydown', onResizeDecKeydown);
}

function initEffects() {
  uploadEffects.addEventListener('click', onEffectsClick);
}

function onUploadPhoto(evt) {
  uploadImage.classList.toggle('hidden');
  uploadOverlay.classList.toggle('hidden');

  uploadHashtags.setAttribute('pattern', '('
    + HashtagsOption.SYMBOL
    + '\\w{1,'
    + HashtagsOption.LENGTH
    + '}\\b ?){0,'
    + HashtagsOption.AMOUNT
    + '}');

  initUploadClose();
  initUploadSubmit();
  initResize();
  initEffects();
}

uploadFile.addEventListener('change', onUploadPhoto);

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
  } else {
    uploadHashtags.setCustomValidity('');
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
  }
});
