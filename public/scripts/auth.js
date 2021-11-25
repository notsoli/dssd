// wait for document to load
window.onload = init;

let dom = {}

function init() {
  dom = {
    formPassword: document.querySelector("#formPassword"),
    formSubmit: document.querySelector("#formSubmit"),
    errorMessage: document.querySelector("#errorMessage")
  }

  dom.formSubmit.addEventListener('click', submitAuthForm)
}

function submitAuthForm() {
  // create a FormData object for ajax requests
  const authForm = new FormData()

  // append file to form data
  authForm.append("password", formPassword.value)

  // create a new ajax request
  request = new XMLHttpRequest()

  // prepare to receive response
  request.addEventListener("readystatechange", handleResponse)

  // send request
  request.open("POST", "/auth")
  request.send(authForm)
}

function handleResponse() {
  if (this.readyState == 4) {
    // store request response
    const response = JSON.parse(this.response)

    if (response.status == 200) {
      location.reload()
    } else if (response.status == 401) {
      dom.errorMessage.innerHTML = "Password is incorrect. Please try again."
    }
  }
}