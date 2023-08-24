import { PixabayServiceApi } from './js/pixabay-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadBtnEl = document.querySelector('#load-btn');

formEl.addEventListener('submit', handlerFormSubmit);
loadBtnEl.addEventListener('click', handlerLoadMoreBtn);

const pixabayServiceApi = new PixabayServiceApi();

let lightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionDelay: 250,
});

Notiflix.Notify.init({
  position: 'right-top',
  timeout: 3000,
});

async function renderImages() {
  try {
    const images = await pixabayServiceApi.fetchImages();
    if (images.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadBtnEl.classList.add('is-hidden');
      return;
    }

    createMarkup(images);

    if (pixabayServiceApi.page === 1 && pixabayServiceApi.totalHits !== 0) {
      Notiflix.Notify.success(
        `Hooray! We found ${pixabayServiceApi.totalHits} images.`
      );

      if (pixabayServiceApi.totalHits > pixabayServiceApi.per_page) {
        loadBtnEl.classList.remove('is-hidden');
      } else {
        loadBtnEl.classList.add('is-hidden');
      }
    }
  } catch (error) {
    Notiflix.Notify.failure('Something went wrong!');
  }
}

function handlerFormSubmit(evt) {
  evt.preventDefault();
  if (!evt.target.elements.searchQuery.value.trim()) {
    Notiflix.Notify.info('Please, write something');
    return;
  }
  Notiflix.Loading.standard('Loading data, please wait...');
  galleryEl.innerHTML = '';
  pixabayServiceApi.resetPage();
  pixabayServiceApi.query = evt.target.elements.searchQuery.value;
  renderImages();
  Notiflix.Loading.remove();
}

function createMarkup({ hits }) {
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
      <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markupImgCard);
  lightbox.refresh();
}

async function handlerLoadMoreBtn() {
  pixabayServiceApi.incrementPage();

  const totalPerPage =
    (pixabayServiceApi.page - 1) * pixabayServiceApi.per_page;

  if (
    totalPerPage > pixabayServiceApi.totalHits &&
    pixabayServiceApi.page !== 1
  ) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    loadBtnEl.classList.add('is-hidden');
    return;
  }
  await renderImages();
}
