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
  console.log(data)


  await changeModalContentToVideo(data);
  modal.open();
}

// This is where we will change the modal content to Video format.
async function changeModalContentToVideo(data) {
  const apiData = await (await fetch(`/api/fetch-trailer?id=${encodeURIComponent(data.id)}&contentType=${data.media_type}`)).json()

  console.log(data);

  const lists = await (await fetch('/api/getList')).json();
  console.log(lists);
  let htmlString =
    `
    <div class="modal-content-wrapper">
    
      <div class="modal-top" id="video-container"></div>
      <div class="modal-bottom">
        <h2 class="modal-title inline">${data.original_title}</h2>
        <img class="addBtn" id="addBtn" src="/assets/addBtn.png" alt="addbtn">
        <p class="modal-description">${data.overview}</p>
      </div>
        
      <div class="list-wrapper" style="display: none">
      
        <img src="" alt="< Back" id="backBtn">
        
        <div class="modal-lists">
    `;

  for (let i = 0; i < lists.length; i++) {

    htmlString +=
      `
          <div class="modal-list-item">
            <h2 class="inline"> ${lists[i].list_name} </h2>
            <input type ="checkbox" class="add-to-list-btn" id="add-to-list-btn#${lists[i].list_id}" name="add-to-list-btn" value="add">
            <!--<img class="add-to-list-btn" id="add-to-list-btn" src="" alt="addBtn"> -->
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

  let inList;
  for (let i = 0; i < lists.length; i++) {
    inList = await (await fetch(`/api/isInList?listId=${lists[i].list_id}&contentId=${data.id}`)).json();
    console.log(inList);

    if (inList) {
      document.getElementById(`add-to-list-btn#${lists[i].listId}`).checked = true;
    }
  }

    const checkbox = document.querySelectorAll('.add-to-list-btn');
    checkbox.forEach((box) => {

      box.addEventListener("change", async () => {

        const listId = box.id.replace("add-to-list-btn#","");
        const contentId = data.id;
        const backdropPath = data.backdropPath;
        const originalTitle = data.title;
        const overview = data.overview;
        const contentType = data.media_type;

        console.log(data)

        let addForm = new FormData();
        addForm.append("listId", listId);
        addForm.append("contentId", contentId);
        addForm.append("backdropPath", backdropPath);
        addForm.append("originalTitle", originalTitle);
        addForm.append("overview", overview);
        addForm.append("contentType", contentType);

        let deleteForm = new FormData();
        deleteForm.append("listId", listId);
        deleteForm.append("contentId", contentId);

        if (box.checked) {
          console.log("TRIED ADDING")
          box.checked = true;
          await fetch('/api/addToList', {method: "POST", body: addForm});
        } else {
          console.log("TRIED DELETING")
          box.checked = false;
          await fetch('/api/removeFromList', {method: "POST", body: deleteForm});
        }

      });
    });

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
      playerVars: {"autoplay": 1, "rel": 0, "showinfo": 0, "modestbranding": 1}
    });
  }