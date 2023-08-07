// form data stuff
const createButton = document.querySelector("#create-button");
const usernameField = document.querySelector("input[name='username']");
const passwordField = document.querySelector("input[name='password']");
const firstField = document.querySelector("input[name='first']");
const lastField = document.querySelector("input[name='last']");

// message from server
const serverMessage = document.querySelector("#server-message");

createButton.addEventListener("click", async () => {
  const formData = new FormData();

  formData.append("username", usernameField.value);
  formData.append("password", passwordField.value);
  formData.append("first", firstField.value);
  formData.append("last", lastField.value);

  fetch("/create-account", {method: "POST", body: formData}).then(response => response.text()).
  then(result => {
    serverMessage.innerHTML = "";
    serverMessage.innerHTML = result;
  });
});

// profile picture stuff
const pfpInput = document.querySelector("#pfp-input");
const defaultPfp = document.querySelector("#create-account-pic");
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
      minCropBoxWidth: 300,
      minCropBoxHeight: 300
    });
  }
});

modal.addFooterBtn("Cancel", "tingle-btn tingle-btn--secondary", function() {
  modal.close();
});

modal.addFooterBtn("Save", "tingle-btn tingle-btn--primary", function() {
  defaultPfp.src = cropper.getCroppedCanvas().toDataURL();
  document.querySelector("#submit-this-img").value = cropper.getCroppedCanvas().toDataURL();
  modal.close();
});

pfpInput.addEventListener("change", () => {
  if (pfpInput.files[0] != undefined) {
    modal.setContent(`<div id="imgdiv"><img src="${URL.createObjectURL(pfpInput.files[0])}" id="crop-this"></div>`);
    modal.open();
  }
});
