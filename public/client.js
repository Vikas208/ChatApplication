const socket = io();

socket.on("connection");
window.addEventListener('load', () => {
  socket.emit('join', document.getElementById("userId").value);
});

const appendSendedMessage = (message) => {

  let msg = `<div class="outgoing_msg">
          <div class="sent_msg">
            <p>${message}</p>
            <span class="time_date">${new Date(Date.now()).toUTCString()}</span>
          </div>
        </div>`;
  let box = document.getElementById('box');
  if (box) {
    box.innerHTML += msg;
  }
}
const appendRecieveMessage = (message,) => {
  let msg = `<div class="incoming_msg">
    <div class="incoming_msg_img">
      <img
        src="https://ptetutorials.com/images/user-profile.png"
        alt="sunil"
      />
    </div>
    <div class="received_msg">
      <div class="received_withd_msg">
        <p>${message}</p>
        <span class="time_date">${new Date(Date.now()).toUTCString()}</span>
      </div>
    </div>
  </div>`;

  let box = document.getElementById('box');
  if (box) {
    box.innerHTML += msg;
  }
}

const sendbtn = document.getElementById("sendbtn");

const sendMessage = () => {
  let messagedata = {
    message: document.getElementsByName("message")[0].value,
    Receiverid: document.getElementsByName("id")[0].value,
    senderId: document.getElementById("userId").value,
  };
  document.getElementsByName("message")[0].value = "";
  console.log(messagedata);
  appendSendedMessage(messagedata.message);
  socket.emit("send", messagedata);

  document.getElementById("nochat").style.display = 'none';

};

socket.on('recieve', (messageData) => {
  let id = document.getElementsByName("id")[0]?.value;
  console.log(id);
  if (id === messageData.senderId)
    appendRecieveMessage(messageData.message);
  document.getElementById("nochat").style.display = 'none';
});