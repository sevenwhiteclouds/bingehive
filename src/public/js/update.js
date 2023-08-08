const updateBtn = document.getElementById('updateBtn');
const updatePswd = document.getElementById('updatePswd');

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

// add a button
/*modal.addFooterBtn('Update', 'tingle-btn tingle-btn--primary', function() {
  // here goes some logic
  modal.close();
});

// add another button
modal.addFooterBtn('Close', 'tingle-btn tingle-btn--danger', function() {
  // here goes some logic
  modal.close();
});*/

updateBtn.addEventListener("click", () => {
// set content
  modal.setContent(document.querySelector('#modal').innerHTML);
  modal.open();
});

const updateButton = document. querySelector("#submitUpdate");
const oldUsername = document.querySelector("#oldUsername");
const newUsername = document.querySelector("#newUsername");

updateButton.addEventListener("click", async () => {
  let formData = new FormData();
  formData.append("oldUsername", oldUsername.value);
  formData.append("newUsername", newUsername.value);
  fetch("/updateUser", {method: "POST", body: formData}).then

})

updatePswd.addEventListener("click", () => {
// set content
  modal.setContent('<h1>Update</h1>');
  modal.open();
});