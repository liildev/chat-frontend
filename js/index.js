/* mock data */
let chatsList = document.querySelector(".chats-list");
let profile = document.querySelector(".profile-body");
let upload = document.getElementById("uploads");

const API = "https://main-chat-backend.herokuapp.com/";

let token = localStorage.getItem("token");
if (!token) window.location = "/login.html";

let userInfo = localStorage.getItem("userInfo");
userInfo = JSON.parse(userInfo);
let userId = userInfo.userId;

const user = JSON.parse(window.localStorage.getItem("userInfo"));

// Profile
function renderProfile(user) {
  profile.innerHTML = null;

  let userName = document.createElement("p");
  let userImg = document.createElement("img");

  userImg.src = API + user.avatar;
  userImg.className = "profile-avatar";
  userName.textContent = user.username;
  profile.append(userName, userImg);
}

renderProfile(user);

// render users
async function getUsers() {
  chatsList.innerHTML = null;

  let res = await fetch(API + "users", {
    method: "GET",
    headers: { token: token },
  });

  let data = await res.json();
  if (!data) return;

  for (let users of data) {
    if (users.userId != userId) {
      let li = document.createElement("li");
      li.className = "chats-item";

      let userName = document.createElement("p");
      userName.className = "chats-username";
      userName.textContent = users.username;

      let userImg = document.createElement("img");
      userImg.className = "chats-avatar";
      userImg.src = API + users.avatar;

      li.append(userImg, userName);
      chatsList.append(li);
    }
  }
}

getUsers();

let uploadedFile = document.querySelector(".uploaded-file");

async function renderFile() {
  uploadedFile.innerHTML = null;
  let res = await fetch(API + "files", {
    headers: { token: token },
  });
  let data = await res.json();
  data = data.data;

  data.forEach((file) => {
    let li = document.createElement("li");
    li.className = "uploaded-file-item";

    let a = document.createElement("a");
    a.setAttribute("download", file.file);
    a.href = file.file;

    let img = document.createElement("img");
    img.src = "./img/file.png";
    img.width = 30;

    let p = document.createElement("p");
    p.textContent = file.file;

    a.append(img, p);
    li.append(a);
    uploadedFile.append(li);
  });
}

renderFile();
