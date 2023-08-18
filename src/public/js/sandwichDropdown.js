const genreElement = document.querySelector('#dropdown-genre');
const typeElement = document.querySelector('#dropdown-type');
const listsElement = document.querySelector('#dropdown-lists');
const content = document.querySelector('#sub-choices-dynamic')

const importedData = exportedData;

function dropdownEvent() {
    document.querySelector('.dropdown-content').classList.toggle("show");
}

// On click, changes the content in '.sub-choices'
function changeActive(element, contentChange) {

  // Clear content
  content.innerHTML = '';

  switch(element.id) {

    case 'dropdown-genre':

      element.style.color = 'white';
      typeElement.style.color = '#FDCC00';

      changeContent(element, contentChange);

      break;

    case 'dropdown-type':
      element.style.color = 'white';
      genreElement.style.color = '#FDCC00';

      changeContentType(element, contentChange);

      break;

    default:
      console.error('SWITCH ERROR');

  } // an error shows here in replit, but it looks to be a bug with the site...

}

function changeContent(element, contentChange) {

  // innerHTML auto-closes tags. By design, tags need to remain open over iterations.
  let changeString = '';

    for (let i = 0; i < contentChange.length; i++) {

      // Makes new div every 6 items
      if (i % 6 === 0) {

        // Closes div made below every 6 items
        if (i > 0) {
          changeString += '</div>';
        }

        changeString +=
          `<div class="sub-choices">
              <h4 class="sub-choice" onclick="serverFunction(this)"> ${contentChange[i]} </h4>`

      } else {
        changeString +=
          `<h4 class="sub-choice" onclick="serverFunction(this)"> ${contentChange[i]}</h4>`
      }
    }

  // if contentChange.length is < 6 innerHTML will auto close the element!
  content.innerHTML = changeString;

}

function changeContentType(element, contentChange) {

  // innerHTML auto-closes tags. By design, tags need to remain open over iterations.
  let changeString = '';

    for (let i = 0; i < contentChange.length; i++) {

      // Makes new div every 6 items
      if (i % 6 === 0) {

        // Closes div made below every 6 items
        if (i > 0) {
          changeString += '</div>';
        }

        changeString +=
          `<div class="sub-choices">
              <h4 class="sub-choice"> <a href='/${contentChange[i].toLowerCase()}'>${contentChange[i]} </a></h4>`

      } else {
        changeString +=
          `<h4 class="sub-choice"> <a href='/${contentChange[i].toLowerCase()}' >${contentChange[i]}</a></h4>`
      }
    }

  // if contentChange.length is < 6 innerHTML will auto close the element!
  content.innerHTML = changeString;

}

// Closes menu if user clicks away from dropdown
window.onclick = function(event) {
    if (!event.target.matches('#sandwich') && !event.target.matches('.sub-choice') && !event.target.matches('.dropdown-choice')
        && !event.target.matches('.main-choices') && !event.target.matches('.sub-choices') && !event.target.matches('#sub-choices-dynamic')) {

        let dropdowns = document.querySelectorAll(".dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].classList.contains('show')) {
                dropdowns[i].classList.remove('show');
            }
        }

    }
}

//////////////////////////////////// On click events ////////////////////////////////////

function serverFunction(input) {
  const actionText = input.innerText; // Input text ex: "Action"

  const currentPath = window.location.pathname;
  const parts = currentPath.split('/').filter(part => part !== ''); // Split path by slashes and remove empty parts
  const path = parts[parts.length - 1];


  if (path === 'movies'&& importedData.genres.includes(actionText)){

    let genreID = importedData.genres.indexOf(actionText);
    genreID = importedData.genreIDs[genreID];

    fetchData(genreID, path);

  } else if (importedData.tvGenres.includes(actionText)) {

    let genreID = importedData.tvGenres.indexOf(actionText);
    genreID = importedData.tvGenreIDs[genreID];

    fetchData(genreID, path);
  }

}

function fetchData(genreID, path) {

  fetch(`/category?genre=${genreID}&path=${path}`)
    .then((response) => response.json())
    .then((data) => changePageGenre(data))
    .catch((err) => console.error(`SERVER CALL FAILED: ${err}`));
}

function changePageGenre(data) {
  const homeContainer = document.querySelector('#home-container');

  homeContainer.innerHTML =
    `<h3 class='category-title'> ${data[0]} </h3>`

  const movieRows = createMovieRows(data);

  homeContainer.innerHTML +=
    `<div class='subcategory-movies-wrapper'>
        <div class='movie-row'> 
          ${movieRows}
        </div>
     </div>`

}

function createMovieRows(data) {

  let htmlString = '';

  for (let i = 1; i < data.length; i++) {
    for(let j = 0; j < data[i].length; j++) {
      if (data[i][j].backdrop_path != null){
        htmlString += `
          <div class='movie-cell'> <img class='movie' src='https://image.tmdb.org/t/p/w780${data[i][j].backdrop_path}' alt='movie-img'> 
              <div class='hover' onclick='modalOpen(${JSON.stringify(data[i][j]).replace(/'/g, "")})' id='modal#<%= i %>'>
                <h4 class="hover-movie-title">${data[i][j].original_title}</h4>
              </div>
          </div>`
      }
    }
  }

  return htmlString;

}