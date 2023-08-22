import './js/pixabay-api';
import { PixabayServiceApi } from './js/pixabay-api';

import Notiflix from 'notiflix';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadBtnEl = document.querySelector('.load-btn');

formEl.addEventListener('submit', handlerFormSubmit);

const pixabayServiceApi = new PixabayServiceApi();

Notiflix.Notify.init({
  position: 'center-center',
});

export function createMarkup({ hits }) {
  const markupImgCard = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
    <a class="photo-link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
</a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforend', markupImgCard);
}
