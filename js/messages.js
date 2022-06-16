const elChatForm = document.querySelector(".chat-footer");
const elChat = document.querySelector(".chat-main");

elChatForm.onsubmit = async (evt) => {
  evt.preventDefault();

  let { message, uploads } = evt.target.elements;
  let messageForm = new FormData();

  messageForm.append("file", uploads.files[0]);
  messageForm.append("message", message.value);
  messageForm.append("userId", user.userId);

  let res = await fetch(API + "messages", {
    method: "POST",
    headers: {
      token: token,
    },
    body: messageForm,
  });

  message.value = null;
  uploads.files = null;

  renderMessages();
};

async function renderMessages() {
  elChat.innerHTML = null;

  let res = await fetch(API + "messages", {
    headers: { token: token },
  });
  let data = await res.json();
  data = data.data;

  let messages = data.sort((a, b) => a.message_date - b.message_date);

  for (let message of messages) {
    let time = new Date(message.time);
    time = time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    if (message.user.userId == user.userId) {
      if (message.message) {
        let box = document.createElement("div");
        box.className = "msg-wrapper msg-from";

        let img = document.createElement("img");
        img.src = API + message.user.avatar;

        let div = document.createElement("div");
        div.className = "msg-text";

        let contentdiv = document.createElement("div");
        contentdiv.contentEditable = true;
        contentdiv.className = "title";

        let userMessage = document.createElement("p");
        userMessage.className = "msg";
        userMessage.textContent = message.message;

        let timeMessage = document.createElement("p");
        timeMessage.className = "time";
        timeMessage.textContent = time;

        let authorName = document.createElement("p");
        authorName.className = "msg-author";
        authorName.textContent = message.user.username;

        //dropdown
        let dropDown = document.createElement("div");
        dropDown.setAttribute("class", "dropdown");

        let dots = document.createElement("img");
        dots.className = "dots";
        dots.src = "./img/dots.png";

        let dropdownContent = document.createElement("div");
        dropdownContent.setAttribute("class", "dropdown-content");

        let edit = document.createElement("a");
        edit.textContent = "EDIT";
        edit.onclick = async () => {
          console.log(userMessage.innerHTML);
          let res = await fetch(API + `user/messages/${message.messageId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
            body: JSON.stringify({ message: userMessage.innerHTML }),
          });
        };

        let deleteEl = document.createElement("a");
        deleteEl.textContent = "DELETE";
        deleteEl.onclick = async () => {
          let res = await fetch(API + `user/messages/${message.messageId}`, {
            method: "DELETE",
            headers: { token: token },
          });
        };

        //dropdown
        dropdownContent.append(edit, deleteEl);
        dropDown.append(dots, dropdownContent);

        let div2 = document.createElement("div");

        div2.append(authorName, dropDown);
        contentdiv.append(userMessage);
        div.append(div2, contentdiv, timeMessage);
        box.append(img, div);
        elChat.append(box);
      }

      if (message.file) {
        let box = document.createElement("div");
        box.className = "msg-wrapper msg-from";

        let img = document.createElement("img");
        img.src = API + message.user.avatar;

        let div = document.createElement("div");
        div.className = "msg-file";

        let authorName = document.createElement("p");
        authorName.className = "msg-author";
        authorName.textContent = message.user.username;

        let userFile = document.createElement("object");
        userFile.className = "msg object-class";
        userFile.data = API + message.file;

        let a = document.createElement("a");
        a.download = message.file;
        // a.setAttribute("download", message.file);

        let img2 = document.createElement("img");
        img2.src = "./img/download.png";
        img2.width = 25;

        let timeMessage = document.createElement("p");
        timeMessage.className = "time";
        timeMessage.textContent = time;

        //dropdown
        let dropDown = document.createElement("div");
        dropDown.setAttribute("class", "dropdown");

        let dots = document.createElement("img");
        dots.className = "dots";
        dots.src = "./img/dots.png";

        let dropdownContent = document.createElement("div");
        dropdownContent.setAttribute("class", "dropdown-content");

        let deleteEl = document.createElement("a");
        deleteEl.textContent = "DELETE";
        deleteEl.onclick = async () => {
          let res = await fetch(API + `user/messages/${message.messageId}`, {
            method: "DELETE",
            headers: { token: token },
          });
        };

        //dropdown
        dropdownContent.append(deleteEl);
        dropDown.append(dots, dropdownContent);

        let div2 = document.createElement("div");

        div2.append(authorName, dropDown);

        a.append(img2);
        div.append(div2, userFile, a, timeMessage);
        box.append(img, div);
        elChat.append(box);
      }
    } else {
      let box = document.createElement("div");
      box.className = "msg-wrapper";

      let img = document.createElement("img");
      img.src = API + message.user.avatar;

      let div = document.createElement("div");
      div.className = "msg-text green";

      let authorName = document.createElement("p");
      authorName.className = "msg-author";
      authorName.textContent = message.user.username;

      let userMessage = document.createElement("p");
      userMessage.className = "msg";
      userMessage.textContent = message.message;

      let timeMessage = document.createElement("p");
      timeMessage.className = "time";
      timeMessage.textContent = time;

      div.append(authorName, userMessage, timeMessage);
      box.append(img, div);
      elChat.append(box);

      if (message.file) {
        let box = document.createElement("div");
        box.className = "msg-wrapper";

        let img = document.createElement("img");
        img.src = API + message.user.avatar;

        let div = document.createElement("div");
        div.className = "msg-file green";

        let authorName = document.createElement("p");
        authorName.className = "msg-author";
        authorName.textContent = message.user.username;

        let userFile = document.createElement("object");
        userFile.className = "msg object-class";
        userFile.data = API + message.file;

        let a = document.createElement("a");
        a.download = message.file;

        let img2 = document.createElement("img");
        img2.src = "./img/download.png";
        img2.width = 25;

        let timeMessage = document.createElement("p");
        timeMessage.className = "time";
        timeMessage.textContent = time;

        a.append(img2);
        div.append(authorName, userFile, a, timeMessage);
        box.append(img, div);
        elChat.append(box);
      }
    }
  }
}

renderMessages();
