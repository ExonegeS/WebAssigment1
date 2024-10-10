let intervalId;

function showContactMe() {
    let parent = document.getElementsByTagName('body')[0];

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
        // Change it to the Oct 11 2024 form;

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
        </div>
    `;

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