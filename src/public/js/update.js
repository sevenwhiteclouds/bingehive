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
modal.addFooterBtn('Update', 'tingle-btn tingle-btn--primary', function() {
  // here goes some logic
  modal.close();
});

// add another button
modal.addFooterBtn('Close', 'tingle-btn tingle-btn--danger', function() {
  // here goes some logic
  modal.close();
});

updateBtn.addEventListener("click", () => {
// set content
  modal.setContent('<input type="password" id="old>Update</h1>');
  modal.open();
});

updatePswd.addEventListener("click", () => {
// set content
  modal.setContent('<h1>Update</h1>');
  modal.open();
});