// =====================================
// EventHub Dashboard
// dashboard.js
// =====================================

// ---------- Check Login ----------

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {

    alert("Please login first!");

    window.location.href = "login.html";

}

// ---------- Show User Name ----------

const userName = document.getElementById("userName");

userName.textContent = user.name;

// ---------- Hamburger Menu ----------

const menuBtn = document.getElementById("menuBtn");

const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {

    navLinks.classList.toggle("active");

});


// =====================================
// Logout
// =====================================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        alert("Logout Successful");

        window.location.href = "login.html";

    }

});

// =====================================
// Load Available Events
// =====================================

const API_URL = "http://localhost:5000/api/events";

async function loadEvents() {

    try {

        const response = await fetch(API_URL);

        const events = await response.json();

        const eventContainer = document.getElementById("eventContainer");

        const availableCount = document.getElementById("availableCount");

        eventContainer.innerHTML = "";

        availableCount.textContent = events.length;

        events.forEach(event => {

            eventContainer.innerHTML += `

            <div class="event-card">

                <h3>${event.title}</h3>

                <p>📝 ${event.description}</p>

                <p>📅 ${new Date(event.date).toLocaleDateString()}</p>

                <p>📍 ${event.location}</p>

                <p>👥 Capacity : ${event.capacity}</p>

                <button
                    class="registerBtn"
                    data-id="${event._id}">

                    Register Now

                </button>

            </div>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

}



// =====================================
// Register Event
// =====================================

document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("registerBtn")) return;

    const eventId = e.target.dataset.id;

    try {

        const response = await fetch("http://localhost:5000/api/registrations", {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "Authorization": `Bearer ${token}`

            },

            body: JSON.stringify({

                event: eventId

            })

        });

        const data = await response.json();

        alert(data.message);

        if (response.ok) {

            loadEvents();

            loadRegistrations();

        }

    }

    catch (error) {

        console.log(error);

        alert("Registration Failed");

    }

});




// =====================================
// Load My Registrations
// =====================================

async function loadRegistrations() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/registrations/my",
            {

                headers: {

                    "Authorization": `Bearer ${token}`

                }

            }
        );

        const registrations = await response.json();
        console.log("Registrations:", registrations);
       

        const registrationContainer =
            document.getElementById("registrationContainer");

        const registeredCount =
            document.getElementById("registeredCount");

        registrationContainer.innerHTML = "";

        registeredCount.textContent = registrations.length;

        registrations.forEach(registration => {

            registrationContainer.innerHTML += `

            <div class="registration-card">

                <h3>${registration.event.title}</h3>

                <p>📍 ${registration.event.location}</p>

                <p>📅 ${new Date(registration.event.date).toLocaleDateString()}</p>

                <button
                    class="cancelBtn"
                    data-id="${registration._id}">

                    Cancel Registration

                </button>

            </div>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}


// =====================================
// Cancel Registration
// =====================================

document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("cancelBtn")) return;

    const registrationId = e.target.dataset.id;

    const confirmCancel = confirm(
        "Are you sure you want to cancel this registration?"
    );

    if (!confirmCancel) return;

    try {

        const response = await fetch(
            `http://localhost:5000/api/registrations/${registrationId}`,
            {

                method: "DELETE",

                headers: {

                    "Authorization": `Bearer ${token}`

                }

            }
        );

        const data = await response.json();

        alert(data.message);

        if (response.ok) {

            loadEvents();

            loadRegistrations();

        }

    }

    catch (error) {

        console.log(error);

        alert("Something went wrong!");

    }

});
// Initial Load

loadEvents();

loadRegistrations();

