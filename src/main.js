import './css/styles.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

const formEl = document.querySelector('.form');
const loadMoreBtnEl = document.querySelector('.load-more');

let queryGlobal = '';
let page = 1;
let totalHits = 0;
const PER_PAGE = 15;

formEl.addEventListener('submit', onSearchSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMore);

hideLoader();
hideLoadMoreButton();

async function onSearchSubmit(evt) {
  evt.preventDefault();

  const query = evt.currentTarget.elements['search-text'].value.trim();

  if (!query) {
    hideLoader();
    hideLoadMoreButton();
    iziToast.warning({
      message: 'Please enter a search query.',
      position: 'topRight',
    });
    return;
  }

  queryGlobal = query;
  page = 1;

  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(queryGlobal, page);
    totalHits = data.totalHits;
    const images = data.hits;

    if (!images || images.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(images);

    const totalPages = Math.ceil(totalHits / PER_PAGE);

    if (page < totalPages) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (err) {
    iziToast.error({
      message: err.message || 'Request failed. Please try again.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    formEl.reset();
  }
}

async function onLoadMore() {
  page += 1;

  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(queryGlobal, page);
    const images = data.hits;

    if (!images || images.length === 0) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      return;
    }

    createGallery(images);
    smoothScrollAfterRender();

    const totalPages = Math.ceil(totalHits / PER_PAGE);

    if (page < totalPages) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (err) {
    iziToast.error({
      message: err.message || 'Request failed. Please try again.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

function smoothScrollAfterRender() {
  const firstCard = document.querySelector('.gallery-item');
  if (!firstCard) return;

  const cardHeight = firstCard.getBoundingClientRect().height;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
