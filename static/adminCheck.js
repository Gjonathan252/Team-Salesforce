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
        if (data._id === "601b1b2d37181cdf8f000e54") {
            console.log(data._id);
            document.getElementById('username').innerHTML = ("Admin")
        }
        else {
            window.location.href = "/public/index.html";
        }
    });