const genreElement = document.querySelector('#dropdown-genre');
const typeElement = document.querySelector('#dropdown-type');
const listsElement = document.querySelector('#dropdown-lists');
const content = document.querySelector('#sub-choices-dynamic')

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

      changeContent(element, contentChange);
      
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
              <h4 class="sub-choice"> ${contentChange[i]} </h4>`
        
      } else {
        changeString += 
          `<h4 class="sub-choice"> ${contentChange[i]}</h4>`
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