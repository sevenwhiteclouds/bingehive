const allMovies = document.querySelectorAll('.hover');

// instanciate new modal
var modal = new tingle.modal({
  footer: true,
  stickyFooter: false,
  closeMethods: ['overlay', 'escape'],
  closeLabel: "Close",
  cssClass: ['movie-modal'],
  onOpen: function() {
    console.log('modal open');
  },
  onClose: function() {
    console.log('modal closed');
  },
  beforeClose: function() {
    // here's goes some logic
    // e.g. save content before closing the modal
    return true; // close the modal
    return false; // nothing happens
  }
});

// set content
modal.setContent('<h1>here\'s some content</h1>');

// add a button
modal.addFooterBtn('Button label', 'tingle-btn tingle-btn--primary', function() {
  // here goes some logic
  modal.close();
});

// add another button
modal.addFooterBtn('Dangerous action !', 'tingle-btn tingle-btn--danger', function() {
  // here goes some logic
  modal.close();
});

// allMovies.forEach((element) => {
//   element.addEventListener('click', (data) => {
//     modalOpen(data);
//   });
// });

function modalOpen(data, index) {
  modal.open();
  console.log(data);
}