let intervalId;
const body = document.getElementsByTagName('body')[0];
let bgInterval;
let username = "Anonymys";
const audio = new Audio('../src/discord-call-sound.mp3');

document.addEventListener('DOMContentLoaded', function() {
    
    updateTheme();

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
    overlay.style.alignItems = 'center';

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
        <div class='contact-form-wrap border border-light form-control p-5'>
            <div class='col-md-6 mb-3'>
                <label class='form-label fs-7 fw-bold' for='field-log'>Login</label>
                <input class='form-control bg-transparent border-light text-reset' id='field-log' name='log' required='' type='text' placeholder='Enter Login'/>
            </div>
            <div class='col-md-6 mb-3'>
                <label class='form-label fs-7 fw-bold' for='field-password'>Password</label>
                <input class='form-control bg-transparent border-light text-reset' id='field-password' name='password' required='' type='password' placeholder='Enter Password'/>
            </div>
            <div class='col-md-6 mb-3'>
                <label class='form-label fs-7 fw-bold' for='field-file'>Upload File</label>
                <input class='form-control bg-transparent border-light text-reset' id='field-file' name='file' required='' type='file' accept='.pdf,.docx'/>
            </div>
            <div class='col-md-6 mb-3'>
                <label class='form-label fs-7 fw-bold' for='field-email'>Email</label>
                <input class='form-control bg-transparent border-light text-reset' id='field-email' name='email' required='' type='email' placeholder='Enter Email'/>
            </div>
            <div class='col-12 mb-3 d-flex justify-content-center'>
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
    
        // Create a .txt file from the email address
        const emailTextBlob = new Blob([data.email], { type: 'text/plain' });
        formData.append('emails', emailTextBlob, 'emails.txt');
        alert(btoa(`${formData.get('log')}:${formData.get('password')}`))
        console.log(btoa(`${formData.get('log')}:${formData.get('password')}`))
        try {
            const response = await fetch('https://doodocs-days-backend.onrender.com/api/mail/file', {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa(`${formData.get('log')}:${formData.get('password')}`),
                },
                body: formData,
            });
        
            if (response.ok) {
                const result = await response.json();
                document.querySelector('.fw-bold.text-center').innerText = 'Your message has been sent successfully!';
                contactUsForm.reset(); // Reset the form fields
            } else {
                const errorMessage = await response.text(); // Get the error response text
                throw new Error(`Network response was not ok: ${errorMessage}`);
            }
        } catch (error) {
            document.querySelector('.fw-bold.text-center.text-danger').innerText = 'There was an error sending your message. Please try again.';
            console.error('Error details:', error); // Log the error for debugging
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

let loading = false
const loadingElement = document.createElement("div")
let loadIntervalId
loadingElement.id = 'loading-3';
function toggleLoading() {
    loading = ! loading
    i = 0;
    console.log(loadIntervalId)
    if (loading) {loadIntervalId = setInterval(() => {
        loadingElement.id = `loading-${i%4}`
        i++
    }, 1000)
        document.getElementsByTagName('body')[0].appendChild(loadingElement)
    } else {
        clearInterval(loadIntervalId)
        loadingElement.remove()
    }
}


let theme = localStorage.getItem('theme') || 'light';

function toggleTheme() {
    if (theme === 'light') {
        theme = 'dark';
    } else {
        theme = 'light';
    }
    localStorage.setItem('theme', theme);
    updateTheme();
}

function updateTheme() {
    const themeStylesheet = document.getElementById('themeStylesheet');
    if (theme === 'light') {
        themeStylesheet.href = './styles.css';
    } else {
        themeStylesheet.href = './dark-styles.css';
    }
}