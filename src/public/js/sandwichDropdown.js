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
      listsElement.style.color = '#FDCC00';

      changeContent(element, contentChange);
      
      break;
      
    case 'dropdown-type':
      element.style.color = 'white';
      genreElement.style.color = '#FDCC00';
      listsElement.style.color = '#FDCC00';

      changeContentType(element, contentChange);
      
      break;
      
    case 'dropdown-lists':
      element.style.color = 'white';
      typeElement.style.color = '#FDCC00';
      genreElement.style.color = '#FDCC00';
      
      changeContent(element, contentChange);
      
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
              <h4 class="sub-choice"> <a href='/${contentChange[i]}'>${contentChange[i]} </a></h4>`
        
      } else {
        changeString += 
          `<h4 class="sub-choice"> <a href='/${contentChange[i]}' >${contentChange[i]}</a></h4>`
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
  const actionText = input.innerText;
  console.log(actionText);

  if (importedData.genres.includes(actionText)){
    
    let genreID = importedData.genres.indexOf(actionText);
    genreID = importedData.genreIDs[genreID];
    
    fetch(`/category?genre=${genreID}`)
    .then((response) => response.json())
    .then((data) => changePageGenre(data))
    .catch((err) => console.error(`SERVER CALL FAILED: ${err}`));
  }

}

function changePageGenre(data) {
  const homeContainer = document.querySelector('#home-container');
  
  console.log(data)

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

// function changePageTelevision(data) {
//   const homeContainer = document.querySelector('#home-container');
//   console.log(data)
  
//   homeContainer.innerHTML = 
//     `
//     <div class="banner">
//         <img src="${data.bannerUrl}" alt="banner image" class="banner-img">
//         <div class="banner-info">
//             <h2 class="banner-title">${data.title}</h2>
//             <p class="banner-desc">${data.description}</p>
//         </div>
//     </div>
//     `

//   homeContainer.innerHTML += 
//     `
//       <div class="slide">
//         <h4 class="row-title">My Lists</h4>
//         <div class="carousel" id="list-carousel">
//             <div class="carousel-item">
//                 <img src="/assets/ListPlaceholder.png" alt="list-item" class="cell">
//             </div>
//             <div class="carousel-item">
//                 <img src="/assets/ListPlaceholder.png" alt="list-item" class="cell">
//             </div>
//             <div class="carousel-item">
//                 <img src="/assets/ListPlaceholder.png" alt="list-item" class="cell">
//             </div>
//         </div>

//         <button class="carousel-button1 prev" id="b1">&#8249;</button>
//         <button class="carousel-button2 next" id="b2">&#8250;</button>
//       </div>
//     `

//   let htmlString;

//   htmlString = 
//     `
//       <div class="slide" id='trending-slide'>
//         <h4 class="row-title">Trending Now</h4>
//         <div class="carousel" id="Trending-carousel">
//     `

//     for (let i = 0; i < data.trendingShowsImg.length; i++) {
//       htmlString += 
//         `
//         <div class="carousel-item">
//             <img src="https://image.tmdb.org/t/p/w780${data.trendingShowsImg[i]}" alt="list-item" class="cell">
//         </div>
//         `
//     }

//   homeContainer.innerHTML += htmlString;
//   htmlString = '';

//   homeContainer.innerHTML +=
//     `
//       </div>
//         <button class="carousel-button1 prev" id="b3">&#8249;</button>
//         <button class="carousel-button2 next" id="b4">&#8250;</button>
//       </div>
//     `

//   //Continue with genres. Need genre API call.
//   //Think about making TV into a separate page. JS needs to run on creation. Can maybe do here, who knows.

// }

function createMovieRows(data) {
  
  let htmlString = '';

  for (let i = 1; i < data.length; i++) {
    for(let j = 0; j < data[i].length; j++) {
      if (data[i][j].backdrop_path != null){
        htmlString += `<div class='movie-cell'> <img class='movie' src='https://image.tmdb.org/t/p/w780${data[i][j].backdrop_path}' alt='movie-img'> </div>`
      }
    }
  }

  return htmlString;
  
}