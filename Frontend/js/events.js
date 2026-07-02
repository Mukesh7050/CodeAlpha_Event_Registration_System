const BASE_URL = "https://codealpha-event-registration-system-qxlu.onrender.com";
// ==========================
// Load Events
// ==========================

async function loadEvents() {

    try {

        const response = await fetch(`${BASE_URL}/api/events`);

        const events = await response.json();

        const eventContainer = document.getElementById("eventContainer");

        eventContainer.innerHTML = "";

        events.forEach(event => {

            eventContainer.innerHTML += `

            <div class="event-card">

                <h3>${event.title}</h3>

                <p>📝 ${event.description}</p>

                <p>📅 ${new Date(event.date).toLocaleDateString()}</p>

                <p>📍 ${event.location}</p>

                <p>👥 Capacity : ${event.capacity}</p>

                <button class="registerBtn">

                    Register Now

                </button>

            </div>

            `;

        });

    }

    catch(error){

        console.log("Error :", error);

    }

}

loadEvents();


// ==========================
// Mobile Menu
// ==========================

const menuBtn = document.getElementById("menuBtn");

const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click",()=>{

    navLinks.classList.toggle("active");

});


// ==========================
// Explore Button
// ==========================

document.getElementById("exploreBtn")

.addEventListener("click",()=>{

document.getElementById("events")

.scrollIntoView({

behavior:"smooth"

});

});


// ==========================
// Active Navbar
// ==========================

const sections=document.querySelectorAll("section");

const navItems=document.querySelectorAll(".nav-links a");

window.addEventListener("scroll",()=>{

let current="";

sections.forEach(section=>{

const sectionTop=section.offsetTop-120;

if(pageYOffset>=sectionTop){

current=section.getAttribute("id");

}

});

navItems.forEach(link=>{

link.classList.remove("active");

if(link.getAttribute("href")==="#"+current){

link.classList.add("active");

}

});

});