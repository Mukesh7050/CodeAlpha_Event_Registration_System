const loginForm = document.getElementById("loginForm");

const message = document.getElementById("message");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    try {

        const response = await fetch("https://codealpha-event-registration-system-qxlu.onrender.com/api/users/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });

        const data = await response.json();

        if (response.ok) {

            message.style.color = "green";

            message.innerText = data.message;

            // Save JWT Token
            localStorage.setItem("token", data.token);

            // Save Logged-in User Email
            localStorage.setItem("user", JSON.stringify(data.user));

            loginForm.reset();

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 1500);

        }

        else {

            message.style.color = "red";

            message.innerText = data.message;

        }

    }

    catch (error) {

        console.log(error);

        message.style.color = "red";

        message.innerText = "Server Error";

    }

});