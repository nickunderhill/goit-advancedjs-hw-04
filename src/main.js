import { getImages } from './js/pixabay-api';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

document.addEventListener('DOMContentLoaded', init);

function init() {
  const form = document.getElementById('search-form');
  const gallery = document.querySelector('.gallery');
  const loadMoreBtn = document.querySelector('.load-more');
  let searchQuery = '';
  let page = 1;
  const perPage = 40;

  loadMoreBtn.style.display = 'none';
  form.addEventListener('submit', onFormSubmit);
  loadMoreBtn.addEventListener('click', fetchImages);

  async function onFormSubmit(e) {
    e.preventDefault();
    gallery.innerHTML = '';
    searchQuery = e.target.searchQuery.value.trim();
    page = 1;
    await fetchImages();
  }

  async function fetchImages() {
    try {
      const data = await getImages(searchQuery, page, perPage);
      handleResponse(data);
    } catch (error) {
      handleError(error);
    }
  }

  function handleResponse(data) {
    if (data.totalHits === 0) {
      showError('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    renderImages(data.hits);

    if (page === 1) {
      showSuccess(`Hooray! We found ${data.totalHits} images.`);
    } else {
      scrollPage();
    }

    page += 1;
    toggleLoadMoreButton(data.totalHits);
  }

  function handleError(error) {
    console.error(error);
    showError('An error occurred while fetching images. Please try again later.');
  }

  function renderImages(images) {
    const markup = images.map(createImageCard).join('');
    gallery.insertAdjacentHTML('beforeend', markup);
    refreshLightbox();
  }

  function createImageCard({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
    return `
      <div class="photo-card">
          <a href="${largeImageURL}">
              <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
          <div class="info">
              <p class="info-item"><b>Likes</b> ${likes}</p>
              <p class="info-item"><b>Views</b> ${views}</p>
              <p class="info-item"><b>Comments</b> ${comments}</p>
              <p class="info-item"><b>Downloads</b> ${downloads}</p>
          </div>
      </div>
    `;
  }

  function refreshLightbox() {
    const lightbox = new SimpleLightbox('.gallery a', {
      captionDelay: 250,
      captionsData: 'alt',
    });
    lightbox.refresh();
  }

  function scrollPage() {
    const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }

  function toggleLoadMoreButton(totalHits) {
    if (page * perPage >= totalHits) {
      loadMoreBtn.style.display = 'none';
      showInfo("We're sorry, but you've reached the end of search results.");
    } else {
      loadMoreBtn.style.display = 'block';
    }
  }

  function showError(message) {
    iziToast.error({
      title: 'Error',
      position: 'topRight',
      message: message,
    });
  }

  function showSuccess(message) {
    iziToast.success({
      title: 'Success',
      position: 'topRight',
      message: message,
    });
  }

  function showInfo(message) {
    iziToast.info({
      title: 'Info',
      position: 'topRight',
      message: message,
    });
  }
}
