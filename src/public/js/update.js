// profile picture stuff
const pfpInput = document.querySelector("#pfp-input");
const defaultPfp = document.querySelector("#defaultPfp");
let cropper;

const modalPfp = new tingle.modal({
  footer: true,
  stickyFooter: false,
  closeMethods: [],
  closeLabel: "Close",

  beforeOpen: function() {
    let croppingImage = document.querySelector("#crop-this");

    cropper  = new Cropper(croppingImage, {
      viewMode: 3,
      aspectRatio: 1 / 1,
      dragMode: "move",
      cropBoxResizable: false,
      checkOrientation: false,
      wheelZoomRatio: 0.3,
      minCropBoxWidth: 150,
      minCropBoxHeight: 150
    });
  }
});

modalPfp.addFooterBtn("Cancel", "tingle-btn tingle-btn--secondary", () => {
  pfpInput.value = "";
  defaultPfp.src = "/api/image/";
  cropper = undefined;
  modalPfp.close();
});

modalPfp.addFooterBtn("Save", "tingle-btn tingle-btn--primary", async () => {
  let formData = new FormData();

  formData.append("pfp", await new Promise(resolve => {
    cropper.getCroppedCanvas().toBlob(blob => resolve(blob));
  }));

  // TODO: add a try block or something to check that upload was success
  let response = await fetch("/api/update-pfp", {redirect: "follow", method: "POST", body: formData});

  if (response.redirected) {
    window.location.replace(response.url);
  } else {
    serverMessage.innerHTML = "";
    serverMessage.innerHTML = await response.text();
    modalPfp.close();
  }
});

pfpInput.addEventListener("change", () => {
  if (pfpInput.files[0] !== undefined) {
    if (pfpInput.files[0].size < (8 * 1024 * 1024)) {
      serverMessage.innerHTML = "";
      modalPfp.setContent(`<div id="imgdiv"><img src="${URL.createObjectURL(pfpInput.files[0])}" id="crop-this"></div>`);
      modalPfp.open();
    } else {
      pfpInput.value = "";
      serverMessage.innerHTML = "";
      serverMessage.innerHTML = "File too big";
    }
  } else {
    defaultPfp.src = "/assets/default_user_upload.png";
    cropper = undefined;
  }
});

// sk's things start from here on
const updateBtn = document.getElementById('updateBtn');
const updatePswd = document.getElementById('updatePswd');
//const updateButton = document.getElementById('submitUpdate');

// instanciate new modal
const modal = new tingle.modal({
  footer: true,
  stickyFooter: false,
  closeMethods: ['button'],
  closeLabel: "Close",
  cssClass: ['settings'],
  onOpen: function() {
    console.log('modal open');
  },
  onClose: function() {
    console.log('modal closed');
  },
});

const modal2 = new tingle.modal({
  footer: true,
  stickyFooter: false,
  closeMethods: ['button'],
  closeLabel: "Close",
  cssClass: ['settings'],
  onOpen: function() {
    console.log('modal open');
  },
  onClose: function() {
    console.log('modal closed');
  },
});
const serverMessage = document.querySelector("#server-Message2");

// add a button
modal.addFooterBtn('Update', 'tingle-btn tingle-btn--warning tingle-btn--pull-right', function() {
  //const oldUsername = document.getElementById('oldUsername').value;
  const newUsername = document.getElementById('newUsername').value;

  let formData = new FormData();
  //formData.append("oldUsername", oldUsername);
  formData.append("newUsername", newUsername);

  fetch('/settings', {method: "POST", body: formData})
    .then(response => response.text())
    .then(results => {
      serverMessage.innerHTML = results;
      console.log('Server responding:', results);
    })
    .catch(error => {
      console.log('Error:', error);
    });

  modal.close();
});

modal2.addFooterBtn('Update', 'tingle-btn tingle-btn--warning tingle-btn--pull-right', function() {
  const oldPassword = document.getElementById('oldPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  console.log(oldPassword + " " + newPassword);

  let formData = new FormData();
  formData.append("oldPassword", oldPassword);
  formData.append("newPassword", newPassword);

  fetch('/settings/password', {method: "POST", body: formData})
    .then(response => response.text())
    .then(results => {
      serverMessage.innerHTML = results;
      console.log('Server responding:', results);
    })
    .catch(error => {
      console.log('Error:', error);
    });

  modal2.close();
});

// add another button
/*modal.addFooterBtn('Close', 'tingle-btn tingle-btn--danger', function() {
  // here goes some logic
  modal.close();
});*/

/*updateBtn.addEventListener("click", () => {
// set content
  modal.setContent(document.querySelector('#modal').innerHTML);
  modal.open();
});*/

updateBtn.addEventListener("click", () => {
 //modal.setContent(document.querySelector('#modal').innerHTML);
  const username = document.getElementById('userNm').innerHTML;
  modal.setContent(`<div class="updateModal"><br><br>Old Username = ${username} <br><br>
    New Username = <input type="text" id="newUsername" name="newUsername"><br></div>`);
  modal.open();
});

updatePswd.addEventListener("click", () => {
// set content
  modal2.setContent(`<div class="updateModal"><br><br>Old Password = <input type="password" id="oldPassword" name="oldPassword"><br><br>
    New Password = <input type="password" id="newPassword" name="newPassword"><br></div>`);
  modal2.open();
});
