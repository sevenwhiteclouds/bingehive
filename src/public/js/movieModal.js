let player;

// instanciate new modal
var modal = new tingle.modal({
  footer: true,
  stickyFooter: false,
  closeMethods: ['overlay', 'escape'],
  closeLabel: "Close",
  cssClass: ['movie-modal'],
  onClose: function() {
    player.destroy();
  }
});

async function modalOpen(data) {

  const response = await fetch(`/api/fetch-trailer?id=${encodeURIComponent(data.id)}`)
  const apiData = await response.json();
  console.log(apiData)

  console.log(data);
  modal.setContent(`
    <div class="modal-content-wrapper">
        <div class="modal-top" id="video-container"></div>
        <div class="modal-bottom">
            <h2 class="modal-title">${data.original_title}</h2>
            <p class="modal-description">${data.overview}</p>
        </div>
     </div>
  `)

  player = new YT.Player("video-container", {
    videoId: apiData,
    playerVars: { "autoplay": 1, "controls": 1, "rel": 0, "showinfo": 0}
  });

  modal.open();


}