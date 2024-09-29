let username;
let token;

//send login data to server, get JWT back and put it in the local storage
async function login() {
  event.preventDefault();

  const url = "http://localhost:4000/register";

  const username = document.getElementById("username").value;
  const org = document.getElementById("org").value;
  const isAdmin = document.getElementById("admin").checked;

  let headers = new Headers();
  headers.append("Content-Type", "application/json");

  var init = {
    method: "POST",
    headers,
  };

  body = {
    username,
    org,
    isAdmin,
  };

  init.body = JSON.stringify(body);

  let response = await fetch(url, init);

  if (response.ok) {
    response = await response.json();
    if (response.success) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("username", username);
      localStorage.setItem("org", org);
      localStorage.setItem("isAdmin", isAdmin);
      window.location.href = "/";
    } else {
      element =
        `<div class="alert alert-danger alert-dismissible fade show mb-3 mt-3" role="alert">` +
        `${response.err}` +
        `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>` +
        `</div>`;
      document.getElementById("flash").innerHTML = element;
    }
  } else {
    console.log("HTTP Error ", response.status);
    return null;
  }
}
