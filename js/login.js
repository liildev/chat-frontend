let userForm = document.querySelector(".site-form");
let showButton = document.getElementById("showButton");

const API = "https://main-chat-backend.herokuapp.com/";

userForm.onsubmit = async (event) => {
  event.preventDefault();
  let { user_name, user_password } = event.target.elements;

  let res = await fetch(API + "login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: user_name.value,
      password: user_password.value,
    }),
  });

  let data = await res.json();

  console.log(data);
  if (data.token) {
    window.location.replace("index.html");
    alert(data.message);
    window.localStorage.setItem("token", data.token);
    window.localStorage.setItem("userInfo", JSON.stringify(data.data));
  } else {
    window.location = "/register.html";
  }

  usernameInput.value = null;
  passwordInput.value = null;
};

showButton.onclick = function () {
  let inputType = userForm.elements.user_password.type;
  if (inputType == "password") userForm.elements.user_password.type = "text";
  if (inputType == "text") userForm.elements.user_password.type = "password";
};
