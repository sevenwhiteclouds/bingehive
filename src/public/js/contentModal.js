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
  const currentPath = window.location.pathname;
  const parts = currentPath.split('/').filter(part => part !== ''); // Split path by slashes and remove empty parts
  let contentType = parts[parts.length - 1];

  console.log(data)

  if (contentType === 'movies') {
    contentType = 'movie';
  } else if (contentType === 'television') {
    contentType = 'tv';
  } else {
    contentType = data.media_type;
  }

  await changeModalContentToVideo(data, contentType);
  modal.open();
}

// This is where we will change the modal content to Video format.
async function changeModalContentToVideo(data, contentType) {
  const apiData = await (await fetch(`/api/fetch-trailer?id=${encodeURIComponent(data.id)}&contentType=${contentType}`)).json()

  // TODO: make sure to test this works with both the api and the database
  if ((contentType === "movie") || (data.list_id !== undefined)) {
    title = data.original_title;
  } else if (contentType === "tv") {
    title = data.original_name;
  }

  console.log(data);

  const lists = await (await fetch('/api/getList')).json();
  console.log(lists);
  let htmlString =
    `
    <div class="modal-content-wrapper">
    
      <div class="modal-top" id="video-container"></div>
      <div class="modal-bottom">
        <h2 class="modal-title inline">${title}</h2>
        <img class="addBtn" id="addBtn" src="/assets/addBtn.png" alt="addbtn">
        <p class="modal-description">${data.overview}</p>
      </div>
        
      <div class="list-wrapper" style="display: none">
      
        <img src="" alt="< Back" id="backBtn">
        
        <div class="modal-lists">
    `;


  for (const list of lists) {
    htmlString +=
      `
          <div class="modal-list-item">
            <h2 class="inline"> ${list.list_name} </h2>
            <img src="" alt="addBtn">
          </div>
      `;
  }

  htmlString +=
    `
              <button class="new-list-btn"">New List</button>
        </div>
       
      </div>
      
    </div>
    `;

  modal.setContent(htmlString);

  document.querySelector('#addBtn').addEventListener("click", () => {
    player.pauseVideo();

    const videoContainer = document.querySelector("#video-container");
    const modalBottom = document.querySelector(".modal-bottom");
    const listWrapper = document.querySelector(".list-wrapper");
    const backBtn = document.querySelector("#backBtn");

    videoContainer.style.display = "none";
    modalBottom.style.display = "none";
    listWrapper.style.display = "block";

    backBtn.addEventListener("click", () => {
      videoContainer.style.display = "block";
      modalBottom.style.display = "block";
      listWrapper.style.display = "none";
      player.playVideo();
    })
  });

  player = new YT.Player("video-container", {
    videoId: apiData,
    width: "100%",
    height: 600,
    playerVars: { "autoplay": 1, "rel": 0, "showinfo": 0, "modestbranding": 1}
  });
}