/*const updatePswd = document.getElementById('updatePswd');

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

modal.addFooterBtn('Update', 'tingle-btn tingle-btn--primary', function() {
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

  modal.close();
});

updatePswd.addEventListener("click", () => {
  //modal.setContent(document.querySelector('#modal').innerHTML);
  modal.setContent(`Old Password = <input type="text" id="oldPassword" name="oldPassword"><br>
    New Password = <input type="text" id="newPassword" name="newPassword"><br>`);
  modal.open();
});*/