// profile picture stuff
const pfpInput = document.querySelector("#pfp-input");
const defaultPfp = document.querySelector("#defaultPfp");
let cropper;

const modal = new tingle.modal({
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

modal.addFooterBtn("Cancel", "tingle-btn tingle-btn--secondary", function() {
  modal.close();
});

modal.addFooterBtn("Save", "tingle-btn tingle-btn--primary", function() {
  defaultPfp.src = cropper.getCroppedCanvas().toDataURL();
  modal.close();
});

pfpInput.addEventListener("change", () => {
  if (pfpInput.files[0] !== undefined) {
    modal.setContent(`<div id="imgdiv"><img src="${URL.createObjectURL(pfpInput.files[0])}" id="crop-this"></div>`);
    modal.open();
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

createButton.addEventListener("click", async () => {
  let formData = new FormData();

  formData.append("username", usernameField.value);
  formData.append("password", passwordField.value);
  formData.append("first", firstField.value);
  formData.append("last", lastField.value);

  if (cropper !== undefined) {
    let blob = await new Promise(resolve => {
      cropper.getCroppedCanvas().toBlob(blob => resolve(blob));
    });

    formData.append("pfp", blob);
  }

  // TODO: still need to improve this redirect
  let response = await fetch("/create-account", {redirect: "follow", method: "POST", body: formData});
  if (response.redirected) {
    window.location.href = response.url;
  } else {
    serverMessage.innerHTML = "";
    serverMessage.innerHTML = await response.text();
  }
});