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

// This is how we open the Model and initialize the first page.
async function modalOpen(data) {
  await changeModalContentToVideo(data);
  modal.open();
}

// This is where we will change the modal content to Video format.
async function changeModalContentToVideo(data) {

  const response = await fetch(`/api/fetch-trailer?id=${encodeURIComponent(data.id)}`)
  const apiData = await response.json();

  //console.log(data);
  modal.setContent(`
    <div class="modal-content-wrapper">
        <div class="modal-top" id="video-container"></div>
        <div class="modal-bottom">
            <h2 class="modal-title inline">${data.original_title}</h2>
            <img class="addBtn" id="addBtn" src="/assets/addBtn.png" alt="addbtn">
            <p class="modal-description">${data.overview}</p>
        </div>
     </div>
  `)

  document.querySelector('#addBtn').addEventListener("click", () => {
    changeModalToList(data);
  });

  player = new YT.Player("video-container", {
    videoId: apiData,
    width: "100%",
    height: 600,
    playerVars: { "autoplay": 1, "rel": 0, "showinfo": 0, "modestbranding": 1}
  });
}


// This is where we will change the modal content to List format.
function changeModalToList(prevModalData) {

  // Maybe move button to footer.
  modal.setContent(
    `
      <div class="modal-list-wrapper">
        <img src="" alt="< Back" id="backBtn">
        <div class="modal-lists">
          <div class="modal-list-item">
            <h2 class="inline"> Autogenerate these items using generateList() </h2>    
            <img src="" alt="addBtn">     
          </div>
          <div class="modal-list-item">
            <h2 class="inline"> Autogenerate these items using generateList() </h2>       
            <img src="" alt="addBtn">   
          </div>
          <div class="modal-list-item">
            <h2 class="inline"> Autogenerate these items using generateList() </h2>     
            <img src="" alt="addBtn">     
          </div>
        </div>
        <button class="new-list-btn"">New List</button>
      </div>
    `
  )

  document.querySelector('#backBtn').addEventListener("click", async () => {
    await changeModalContentToVideo(prevModalData);
  });
}

// This is where we generate user lists for changeModalToList
function generateList() {

}