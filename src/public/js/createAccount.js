// profile picture stuff
const pfpInput = document.querySelector("#pfp-input");
const defaultPfp = document.querySelector("#defaultPfp");
let cropper;

const modal = new tingle.modal({
  footer: true,
  stickyFooter: false,
  closeMethods: [],
  cssClass: ['crop-modal'],
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
      minCropBoxWidth: 600,
      minCropBoxHeight: 600,
      maxCropBoxWidth: 600,
      maxCropBoxHeight: 600,
      imageSmoothingQuality: 'high',
    });
  },
});

modal.addFooterBtn("Cancel", "tingle-btn tingle-btn--secondary", function() {
  pfpInput.value = "";
  defaultPfp.src = "/assets/default_user_upload.png";
  cropper = undefined;
  modal.close();
});

modal.addFooterBtn("Save", "tingle-btn tingle-btn--primary", function() {
  defaultPfp.src = cropper.getCroppedCanvas({minWidth: 600, minHeight: 600, maxWidth: 600, maxHeight: 600}).toDataURL(pfpInput.files[0].type, 1);
  modal.close();
});

pfpInput.addEventListener("change", () => {
  if (pfpInput.files[0] !== undefined) {
    if (pfpInput.files[0].size < (8 * 1024 * 1024)) {
      serverMessage.innerHTML = "";
      modal.setContent(`<div id="imgdiv"><img src="${URL.createObjectURL(pfpInput.files[0])}" id="crop-this"></div>`);
      modal.open();
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

// form data stuff
const createButton = document.querySelector("#create-button");
const usernameField = document.querySelector("input[name='username']");
const passwordField = document.querySelector("input[name='password']");
const firstField = document.querySelector("input[name='first']");
const lastField = document.querySelector("input[name='last']");

// message from server
const serverMessage = document.querySelector("#server-message");

// monitoring input
createButton.addEventListener("click", grabAndSend)
usernameField.addEventListener("keyup", broHitEnter);
passwordField.addEventListener("keyup", broHitEnter);
firstField.addEventListener("keyup", broHitEnter);
lastField.addEventListener("keyup", broHitEnter);

function broHitEnter(event) {
  if (event.key === "Enter") {
    grabAndSend();
  }
}

async function grabAndSend() {
  let formData = new FormData();

  formData.append("username", usernameField.value);
  formData.append("password", passwordField.value);
  formData.append("first", firstField.value);
  formData.append("last", lastField.value);

  if (cropper !== undefined) {
    let blob = await new Promise(resolve => {
      cropper.getCroppedCanvas({minWidth: 600, minHeight: 600, maxWidth: 600, maxHeight: 600}).toBlob(blob => resolve(blob), pfpInput.files[0].type, 1);
    });

    formData.append("pfp", blob);
  }

  let response = await fetch("/create-account", {redirect: "follow", method: "POST", body: formData});
  if (response.redirected) {
    window.location.href = response.url;
  } else {
    serverMessage.innerHTML = "";
    serverMessage.innerHTML = await response.text();
  }
}
