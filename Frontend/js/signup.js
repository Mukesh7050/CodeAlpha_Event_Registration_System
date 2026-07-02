const signupForm = document.getElementById("signupForm");

const message = document.getElementById("message");

signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validation

    if(password !== confirmPassword){

        message.style.color="red";

        message.innerText="Passwords do not match.";

        return;

    }

    try{

        const response = await fetch("https://codealpha-event-registration-system-qxlu.onrender.com/api/users/signup",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                name,
                email,
                password

            })

        });

        const data = await response.json();

        if(response.ok){

            message.style.color="green";

            message.innerText=data.message;

            signupForm.reset();

            setTimeout(()=>{

                window.location.href="login.html";

            },2000);

        }

        else{

            message.style.color="red";

            message.innerText=data.message;

        }

    }

    catch(error){

        message.style.color="red";

        message.innerText="Server Error";

        console.log(error);

    }

});