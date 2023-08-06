const pfpInput = document.querySelector("#pfp-input");
const defaultPfp = document.querySelector("#create-account-pic");
let cropper;

const modal = new tingle.modal({
  footer: true,
  stickyFooter: false,
  closeMethods: [],
  closeLabel: "Close",

//  onOpen: function() {
//  },
//
//  onClose: function() {
//  },

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