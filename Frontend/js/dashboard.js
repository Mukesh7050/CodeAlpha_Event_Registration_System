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

// =====================================
// Toast Notification
// =====================================

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  toastMessage.innerText = message;

  toast.className = "toast " + type;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ---------- Show User Name ----------

const userName = document.getElementById("userName");

userName.textContent = user.name;

// =====================================
// Greeting
// =====================================

const greeting = document.getElementById("greeting");
const heroMessage = document.getElementById("heroMessage");

const hour = new Date().getHours();

if (hour >= 5 && hour < 12) {
  greeting.innerHTML = "🌞 Good Morning,";

  heroMessage.innerHTML = "Start your day by exploring exciting events.";
} else if (hour >= 12 && hour < 17) {
  greeting.innerHTML = "☀ Good Afternoon,";

  heroMessage.innerHTML = "Don't miss today's amazing opportunities.";
} else {
  greeting.innerHTML = "🌙 Good Evening,";

  heroMessage.innerHTML = "Relax and discover upcoming events.";
}

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

let allEvents = [];

async function loadEvents() {
  try {
    const response = await fetch(API_URL);

    allEvents = await response.json();

    const events = allEvents;

    // Populate Location Filter

    const locationFilter = document.getElementById("locationFilter");

    locationFilter.innerHTML = '<option value="all">📍 All Locations</option>';

    const locations = [...new Set(events.map((event) => event.location))];

    locations.forEach((location) => {
      locationFilter.innerHTML += `
        <option value="${location}">
            ${location}
        </option>
    `;
    });

    const eventContainer = document.getElementById("eventContainer");

    const availableCount = document.getElementById("availableCount");

    eventContainer.innerHTML = "";

    availableCount.textContent = events.length;

    // Get Registered Events

    const registeredEvents = new Set();

    const registrationResponse = await fetch(
      "http://localhost:5000/api/registrations/my",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const myRegistrations = await registrationResponse.json();

    myRegistrations.forEach((item) => {
      registeredEvents.add(item.event._id);
    });

    // Calculate Countdown

    const today = new Date();

    events.forEach((event) => {
      const eventDate = new Date(event.date);

      const diffTime = eventDate - today;

      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let countdown = "";

      if (diffDays > 0) {
        countdown = `⏳ Starts in ${diffDays} Days`;
      } else if (diffDays === 0) {
        countdown = "🔥 Happening Today";
      } else {
        countdown = "❌ Event Ended";
      }

      eventContainer.innerHTML += `

           <div class="event-card" data-location="${event.location.toLowerCase()}">

                <h3>${event.title}</h3>

                <p>📝 ${event.description}</p>

                <p>📅 ${new Date(event.date).toLocaleDateString()}</p>

                <p class="countdown">${countdown}</p>   

                <p>📍 ${event.location}</p>

                <p>👥 Capacity : ${event.capacity}</p>

                <button
                  class="registerBtn ${registeredEvents.has(event._id) ? "registered" : ""}"

                 data-id="${event._id}"

                 ${registeredEvents.has(event._id) ? "disabled" : ""}>

                 ${registeredEvents.has(event._id) ? "✅ Registered" : "Register Now"}   

                </button>

            </div>

            `;
    });
  } catch (error) {
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

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        event: eventId,
      }),
    });

    const data = await response.json();

    showToast(data.message, response.ok ? "success" : "error");

    if (response.ok) {
      loadEvents();

      loadRegistrations();
    }
  } catch (error) {
    console.log(error);

    alert("Registration Failed");
  }
});

// =====================================
// Load My Registrations
// =====================================

async function loadRegistrations() {
  try {
    const response = await fetch("http://localhost:5000/api/registrations/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const registrations = await response.json();
    console.log("Registrations:", registrations);

    const registrationContainer = document.getElementById(
      "registrationContainer",
    );

    const registeredCount = document.getElementById("registeredCount");

    registrationContainer.innerHTML = "";

    registeredCount.textContent = registrations.length;

    registrations.forEach((registration) => {
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
  } catch (error) {
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
    "Are you sure you want to cancel this registration?",
  );

  if (!confirmCancel) return;

  try {
    const response = await fetch(
      `http://localhost:5000/api/registrations/${registrationId}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    showToast(data.message, response.ok ? "success" : "error");

    if (response.ok) {
      loadEvents();

      loadRegistrations();
    }
  } catch (error) {
    console.log(error);

    alert("Something went wrong!");
  }
});

// =====================================
// Live Event Search
// =====================================

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();

  const cards = document.querySelectorAll(".event-card");

  cards.forEach((card) => {
    const title = card.querySelector("h3").innerText.toLowerCase();

    if (title.includes(keyword)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});

// ================= Filter by Location =================
// ================= Filter by Location =================

locationFilter.addEventListener("change", () => {
  const selectedLocation = locationFilter.value.toLowerCase();

  const cards = document.querySelectorAll(".event-card");

  cards.forEach((card) => {
    const cardLocation = card.dataset.location;

    if (selectedLocation === "all" || cardLocation === selectedLocation) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});

// Initial Load

loadEvents();

loadRegistrations();
