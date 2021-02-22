var authtoken = Cookies.get("auth-token");
if (authtoken == undefined) {
    window.location.href = "/public/login.html";
}

var check = Cookies.get("check");
if (check == 0) {
    window.location.href = "/public/login.html";
}

// let data = { authtoken: authtoken };
fetch('/api/user/adminCheck', {
    method: 'POST',
    headers: {
        "Content-Type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify({
        authtoken: authtoken
    }),
})
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        if (data.__v == "0") {
            window.location.href = "/public/login.html";
        }
        else {
            document.getElementById('username').innerHTML = ("Admin")
        }
    });