const allMovies = document.querySelectorAll('.hover');

// instanciate new modal
var modal = new tingle.modal({
  footer: true,
  stickyFooter: false,
  closeMethods: ['overlay', 'escape'],
  closeLabel: "Close",
  cssClass: ['movie-modal'],
});

function modalOpen(data) {
  modal.setContent(`
    <div class="modal-content-wrapper">
        <div class="modal-top">
            <img src="https://image.tmdb.org/t/p/original/${data.backdrop_path}" alt="content-img">
        </div>
        <div class="modal-bottom">
            <h2 class="modal-title">${data.original_title}</h2>
            <p class="modal-description">${data.overview}</p>
        </div>
     </div>
  `)
  modal.open();
}