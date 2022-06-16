let userForm = document.querySelector(".site-form");
let showButton = document.getElementById("showButton");

const API = "https://main-chat-backend.herokuapp.com/";

userForm.onsubmit = async (event) => {
  event.preventDefault();
  let { user_name, user_password, user_email, user_avatar } =
    event.target.elements;
  let userInfo = new FormData();
  userInfo.append("avatar", user_avatar.files[0]);
  userInfo.append("username", user_name.value);
  userInfo.append("password", user_password.value);
  userInfo.append("email", user_email.value);
  console.log(userInfo);

  let res = await fetch(API + "register", {
    method: "POST",
    body: userInfo,
  });

  let data = await res.json();

  if (data.token) {
    window.location.replace("index.html");
    alert(data.message);
    window.localStorage.setItem("token", data.token);
    window.localStorage.setItem("userInfo", JSON.stringify(data.data));
  } else {
    window.location = "/register.html";
  }

  user_name.value = null;
  user_password.value = null;
};

showButton.onclick = function () {
  let inputType = userForm.elements.user_password.type;
  if (inputType == "password") userForm.elements.user_password.type = "text";
  if (inputType == "text") userForm.elements.user_password.type = "password";
};
