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

// add a button
modal.addFooterBtn('Update', 'tingle-btn tingle-btn--warning tingle-btn--pull-right', function() {
  const oldUsername = document.getElementById('oldUsername').value;
  const newUsername = document.getElementById('newUsername').value;
  console.log(oldUsername + " " + newUsername);

  let formData = new FormData();
  formData.append("oldUsername", oldUsername);
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


const serverMessage = document.getElementById('serverMessage');

updateBtn.addEventListener("click", () => {
 //modal.setContent(document.querySelector('#modal').innerHTML);
  modal.setContent(`<div class="updateModal"><br><br>Old Username = <input type="text" id="oldUsername" name="oldUsername"><br><br>
    New Username = <input type="text" id="newUsername" name="newUsername"><br></div>`);
  modal.open();
});


updatePswd.addEventListener("click", () => {
// set content
  modal2.setContent(`<div class="updateModal"><br><br>Old Password = <input type="password" id="oldPassword" name="oldPassword"><br><br>
    New Password = <input type="password" id="newPassword" name="newPassword"><br></div>`);
  modal2.open();
});