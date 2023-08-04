const pfpInput = document.querySelector("#pfp-input");

const modal = new tingle.modal({
  footer: true,
  stickyFooter: false,
  closeMethods: [],
  closeLabel: "Close",

  onOpen: function() {
  },

  //onClose: function() {
  //},

  beforeOpen: function() {
    let image = document.querySelector("#crop-this");

    new Cropper(image, {
      viewMode: 2,
      ratio: 1 / 1,
      dragMode: "move",
      cropBoxMovable: false,
      cropBoxResizable: false,
      checkOrientation: false,
    });
  }
});

modal.addFooterBtn("Cancel", "tingle-btn tingle-btn--secondary", function() {
  modal.close();
});

modal.addFooterBtn("Save", "tingle-btn tingle-btn--primary", function() {
  modal.close();
});

pfpInput.addEventListener("change", () => {
  if (pfpInput.files[0] != undefined) {
    modal.setContent(`<div id="imgdiv"><img src="${URL.createObjectURL(pfpInput.files[0])}" id="crop-this"></div>`);
    modal.open();
  }
});