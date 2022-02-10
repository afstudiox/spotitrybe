const CLIENT_ID = '38f534fcfb8f4ea8bbd83ae12524deea';
const CLIENT_SECRET = 'f10c6a8bed7645f6b9ddcef37fd56c83';
let token;

//HELPERS ===============================================================================================
const getElementOrClosest = (sectionClass, target) => 
  target.classList.contains(sectionClass)
    ? target
    : target.closest(sectionClass);

const clearSelectedItem = (containerSelector) => {
  const element = document.querySelector(`${containerSelector} .item-selected`);
  if (element) {
    element.classList.remove('item-selected');
  }
}

// HANDLERS ===============================================================================================
const handleGenreCardClick = ({ target }) => {
  const genreSection = getElementOrClosest('.genre', target);
  const id = genreSection.id;
  clearSelectedItem('.genre-cards');
  genreSection.classList.add('item-selected');
}

// REQUESTS ===============================================================================================

const getToken = async () => {
  const requestInfo = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
    },
    body: 'grant_type=client_credentials',
  };

  const response = await fetch('https://accounts.spotify.com/api/token', requestInfo);
  const data = await response.json();
  return data.access_token;
};

const getGenres = async (token) => {
  const requestInfo = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`, 
    }
  }

  const url = 'https://api.spotify.com/v1/browse/categories?locale=pt-br' ;
  const response = await fetch(url,requestInfo);
  const data = await response.json();
   return data.categories.items;
} 

// RENDERS ===============================================================================================

const renderGenres = (genres) => {
  const genresCards = document.querySelector('.genre-cards');
  
  genres.forEach((genre) => {
    const section = document.createElement('section');
    section.className = 'genre';
    section.id = genre.id;

    const paragraph = document.createElement('p');
    paragraph.className = 'genre-title';
    paragraph.innerHTML = genre.name;

    const img = document.createElement('img');
    img.classname = 'genre-image';
    img.src = genre.icons[0].url;

    section.appendChild(img);
    section.appendChild(paragraph);
    section.addEventListener('click', handleGenreCardClick);

    genresCards.appendChild(section);
  });  
};

window.onload = async () => {
  token = await getToken();
  const genres = await getGenres(token);
  renderGenres(genres);
  }
