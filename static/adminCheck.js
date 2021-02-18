var authtoken = Cookies.get("auth-token");
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
        if (data.__v == "1") {
            console.log(data);
            document.getElementById('username').innerHTML = ("Admin")
        }
        else {
            window.location.href = "/public/index.html";
        }
    });