import "./css/bootstrap.min.css";
import "./js/bootstrap.bundle.min";

const container = document.getElementById("container");
const spinnerContainer = document.querySelector(".spinner-container");
const alertContainer = document.querySelector(".alert");


const baseUrl = import.meta.env.VITE_RAPIDAPI_BASE_URL;
const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;


const fetchData = async (query) => {
  const url = `${baseUrl}?q=${encodeURIComponent(query)}&type=multi&offset=0&limit=10&numberOfTopResults=5`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'spotify23.p.rapidapi.com'
    }
  };

  try {
    showSpinner();
    hideAlert();
    console.log('Sending request to:', url);
    const response = await fetch(url, options);
    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error details:', errorText);
      showAlert("No results found for this query.");
      return;
    }

    const json = await response.json();
    console.log('Data received:', json);
    handleData(json);
  } catch (error) {
    console.error("Fetch error:", error);
    showAlert("An error occurred while fetching data.");
  } finally {
    hideSpinner();
  }
};


function handleData(data) {
  console.log("data available!!!");
  const dynamicDataContainer = document.querySelector(".dynamic_data");
  dynamicDataContainer.innerHTML = "";


  if (data.artists && data.artists.items && data.artists.items.length > 0) {
    data.artists.items.forEach((artist) => {
      const artistName = artist.data.profile.name;
      const artistGenres = artist.data.genres ? artist.data.genres.join(', ') : 'Genres not available';
      const artistImage = artist.data.visuals.avatarImage?.sources[0]?.url || 'https://via.placeholder.com/150';
      const artistLink = `https://open.spotify.com/artist/${artist.data.uri.split(':')[2]}`;

      dynamicDataContainer.innerHTML += `
        <div class="col">
          <article class="card">
            <img src="${artistImage}" class="card-img-top" alt="${artistName}">
            <div class="card-body">
              <h5 class="card-title">${artistName}</h5>
              <p class="card-text">Genres: ${artistGenres}</p>
              <a href="${artistLink}" class="btn btn-primary" target="_blank">Listen on Spotify</a>
            </div>
          </article>
        </div>
      `;
    });
  } else {
    showAlert("No artists found");
  }
}


function showSpinner() {
  spinnerContainer.classList.remove("d-none");
}

// Скрыть спиннер
function hideSpinner() {
  spinnerContainer.classList.add("d-none");
}

// Показать сообщение об ошибке
function showAlert(message) {
  alertContainer.textContent = message;
  alertContainer.classList.remove("d-none");
}

// Скрыть сообщение об ошибке
function hideAlert() {
  alertContainer.classList.add("d-none");
}

// Добавляем обработчик события для кнопки поиска
document.getElementById('searchButton').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value.trim();
  if (query) {
    fetchData(query);
  } else {
    showAlert("Please enter a search term");
  }
});
