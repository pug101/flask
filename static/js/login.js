function login() {
    var loginForm = document.getElementById("login_form");
    var un = loginForm.Username.value;
    var pw = loginForm.Password.value;
    pw = CryptoJS.MD5(pw).toString();

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/login", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            // Response
            if (this.status == 200) {
                window.location.href = "/";
            } else if (this.status == 401) {
                var loginStatus = document.getElementById("login_status");
                loginStatus.innerText = "Incorrect username/password!";
                loginStatus.style.display = "block";
                loginForm.Username.select();
                loginForm.Username.className = "Highlighted";
                loginForm.reset();
                setTimeout(function () {
                    loginStatus.style.display = 'none';
                }, 3000);
            }
        }
    };

    var data = { username: un, password: pw };
    xhttp.send(JSON.stringify(data));
}

window.addEventListener("load", function () {
    var loginBtn = document.getElementById("login_btn");
    loginBtn.addEventListener("click", function () {
        login();
    });

    var pwdField = document.getElementById("password")
    pwdField.addEventListener("keyup", function (pwdField) {
        // Number 13 is the "Enter" key on the keyboard
        keyCode = pwdField.which || pwdField.keyCode
        if ((keyCode === 13) && (pwdField.value != "")) {
            loginBtn.click();
        }
    });

    var passField = document.getElementById("password");
    document.getElementById("display_pw_chkbox").addEventListener("click", () => passField.type = (passField.type === "password" ? "text" : "password"));

});