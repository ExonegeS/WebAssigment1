let intervalId;
const body = document.getElementsByTagName('body')[0];
let bgInterval;
let username = "Anonymys";
const audio = new Audio('../src/discord-call-sound.mp3');

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navbarCollapse = navbar.querySelector('.navbar-collapse');

    const url = new URL(window.location.href);
    const urlParams = url.searchParams;
    const links = [];

    const navLinks = navbar.querySelectorAll('ul')[0].querySelectorAll('a');
    navLinks.forEach((a) => {
        if (a.href.length > 0 && window.location.href.length > 0) {
            links.push(new URL(a.href).pathname)
            if (new URL(a.href).pathname === new URL(window.location.href).pathname) {
                a.classList.add('text-primary')
            }
        }
    })

    document.addEventListener('keydown', function(event) {
        let linkId = links.indexOf(new URL(window.location.href).pathname);
        if (linkId < 0) {
            return
        }
        if (event.key === 'ArrowRight') {
            linkId = (linkId + 1) % links.length;
            window.location.href = links[linkId];
        } else if (event.key === 'ArrowLeft' ) {
            linkId = (linkId - 1 + links.length) % links.length;
            window.location.href = links[linkId];
        }
    })
})



function showContactMe() {
    let parent = body;

    const contactUsForm = document.createElement('form');
    // Create the overlay and form container
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = 100;
    overlay.style.backgroundColor = 'rgba(0,0,0,.5)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center'

    contactUsForm.id = "contactUsForm";

    function updateDateTime() {
        const currentDate = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        const formattedDate = `${currentDate.toLocaleDateString(undefined, options)}\n${currentDate.toLocaleTimeString('it-IT')}`;
        document.querySelector('.fw-bold.text-center').innerText = formattedDate;
    }
    contactUsForm.innerHTML = `
        <div class='contact-form-wrap border border-light bg-dark p-5'>
            <div class='col-md-6 mb-3'>
                <label class='form-label fs-7 fw-bold' for='field-name'>Your Name</label>
                <input class='form-control bg-transparent border-light text-reset' id='field-name' name='name' required='' type='text' placeholder='Enter Name'/>
            </div>
            <div class='col-md-6 mb-3'>
                <label class='form-label fs-7 fw-bold' for='field-email'>Email Address</label>
                <input class='form-control bg-transparent border-light text-reset' id='field-email' name='email' required='' type='email' placeholder='Enter Email'/>
            </div>
            <div class='col-12 mb-3'>
                <label class='form-label fs-7 fw-bold' for='field-message'>Message</label>
                <textarea class='form-control bg-transparent border-light text-reset' id='field-message' name='message' required='' rows='3' placeholder='Enter Message'></textarea>
            </div>
            <div class='col-4 mb-3'>
                <button class='btn btn-sm fw-bold py-2 px-5 btn-primary' type='submit'>SEND</button>
            </div>
            <div class='col-12 mb-3'>
                <p class='fw-bold text-center'></p>
            </div>
            <div class='col-12 mb-3'>
                <i id="greeting" class='fw-bold text-center'></i>
            </div>
            <div class='col-12 mb-3'>
                <p class='fw-bold text-center text-danger'></p>
            </div>
        </div>
    `;

     // Callback function to handle form submission
     async function handleFormSubmit(event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(contactUsForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            now = new Date().getHours()
            console.log(now) 
            let greetingMsg = `Good day, my fella ${data.name}`
            switch ( Math.floor(now / 6) )  {
                case 0: greetingMsg =  `Not sleeping, <span class="text-primary">${data.name}</span>?` // 0-5
                case 1: greetingMsg =  `Wakey, wakey, <span class="text-primary">${data.name}</span>!` // 6-11
                case 2: greetingMsg =  `Good day my fella <span class="text-primary">${data.name}</span>?` // 11-17
                case 3: greetingMsg =  `Isn't it a good evening, <span class="text-primary">${data.name}</span>?` // 18-23
                
            }
            contactUsForm.querySelector('#greeting').innerHTML = greetingMsg;
            if (response.ok) {
                const result = await response.json();
                document.querySelector('.fw-bold.text-center').innerText = 'Your message has been sent successfully!';
                contactUsForm.reset(); // Reset the form fields
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            document.querySelector('.fw-bold.text-center.text-danger').innerText = 'There was an error sending your message. Please try again.';
        }
    }

    contactUsForm.addEventListener('submit', handleFormSubmit);

    // Add event listener to overlay to close the form when clicked
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
            clearInterval(intervalId); // Clear the interval
        }
    });

    // Add the form to the overlay and append to the body
    overlay.appendChild(contactUsForm);
    document.body.appendChild(overlay);
    
    updateDateTime();
    intervalId = setInterval(updateDateTime, 1000); // Update every 1 second
}

function changeBg() {

    if(!audio.paused && !audio.ended) {
        audio.pause();
    }
    else if (audio.paused) {
        audio.play();
    }

    if (bgInterval) {
        clearInterval(bgInterval);
        bgInterval = null;
        document.getElementById("canvas1").style.background = `` 
    } else {
        bgInterval = setInterval(() => {
            document.getElementById("canvas1").style.background = `hsl(${Date.now()/10%360}, 50%,50%)` 
        });
    }
}

function animateText(element, text='Lorem ipsum dummy text blabla.', speed=50, timeoutId) {
    var i = 0;
    console.log(
        clearTimeout(timeoutId)
    )
    typeWriter();
    function typeWriter() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            return setTimeout(typeWriter, speed);
        }
    }
}

function gcd(a,b) {
    return b == 0 ? a: gcd(Math.min(a,b), Math.max(a,b)%Math.min(a,b))
}

function isPrime(a) {
    for( i = 2; i*i <= a; i++) {
        if (a % i == 0) return false;
    }
    return true;
}