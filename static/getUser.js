
var authtoken = Cookies.get("auth-token");
// let data = {authtoken: authtoken };
fetch('/api/user/getUserName', {
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
        if (data.lastname == undefined) {
            document.getElementById('username').innerHTML = "LOGIN";
        }
        else {
            Cookies.set('name', data.lastname);
            document.getElementById('username').innerHTML = (data.lastname)
        }
    });
