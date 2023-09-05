const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const msg = document.getElementById('msg');
let privateChatReceiver= "";

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
  outputUsers(users);
});

socket.on('message', (message) => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  try{
    e.preventDefault();

    // Get message text
    let msg = e.target.elements.msg.value;
    msg = msg.trim();

    if (!msg) {
      return false;
    }

    // Emit message to server
    if(privateChatReceiver != ""){
      socket.emit('privateChatMessage', {
        privateChatReceiver: privateChatReceiver,
        msg: msg
      }   
      );
    }else{
      socket.emit('chatMessage', msg);
    }

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
  }catch(error){
    console.log("Error in sending chat message from client to server", error);
  }
});

function outputMessage(message) {
  try{
    const div = document.createElement('div');
    div.classList.add('message');

    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);

    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);

    document.querySelector('.chat-messages').appendChild(div);
  }catch(error){
    console.log("Error in displaying chat message in chat room", error);
  }
}

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    li.className = "chat-user";
    li.setAttribute("onclick", 'selectedChatUser(this)');
    userList.appendChild(li);
  });
}

document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');

  if (leaveRoom) {
    window.location = '../index.html';
  }
});

function selectedChatUser(htmlElement) {
  privateChatReceiver = htmlElement.innerText;
  htmlElement.style.backgroundColor = "red";
  msg.placeholder = "Enter your private message to: " + htmlElement.innerText;
}