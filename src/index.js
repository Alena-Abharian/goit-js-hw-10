import './css/styles.css';
import debounce from 'lodash.debounce';
import notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  listCountry: document.querySelector('.country-list'),
  infoCountry: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(onInputValue, DEBOUNCE_DELAY));

function onInputValue(e) {
  const name = e.target.value.trim();
  cleanInnerHTML();
  if (!name) {
    return;
  }

  fetchCountries(name).then(renderCountry).catch(onError);
}

function renderCountry(countries) {
  if (countries.length === 1) {
    renderOneCountry(countries);
  } else if (countries.length > 10) {
    notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  } else {
    renderAllCountries(countries);
  }
}

function renderAllCountries(countries) {
  const markup = countries
    .map(country => {
      return `<li class='country-item'><img src='${country.flags.svg}' width='30px' height='20px'/>
               <p class='country-name'>${country.name}</p></li>`;
    })
    .join('');
  refs.listCountry.insertAdjacentHTML('beforeend', markup);
}

function renderOneCountry(countries) {
  const markup = countries
    .map(country => {
      const { flags, capital, population, languages, name } = country;

      return `<div class='country'><img src='${flags.svg}' width='60px' height='40px'/>
      <h1>${name}</h1></div>
    <p><span class='text-wrap'>Capital: </span>${capital}</p>
    <p><span class='text-wrap'>Population: </span>${population}</p>
    <p><span class='text-wrap'>Languages: </span>${languages.map(({ name }) => name).join(', ')}</p>`;
    })
    .join('');

  refs.infoCountry.insertAdjacentHTML('beforeend', markup);
}

function onError() {
  notiflix.Notify.failure('Oops, there is no country with that name');
}

function cleanInnerHTML() {
  refs.listCountry.innerHTML = '';
  refs.infoCountry.innerHTML = '';
}
