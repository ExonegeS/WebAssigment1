function updateUI() {
    const loggedInUser  = JSON.parse(localStorage.getItem('loggedInUser '));
    if (loggedInUser ) {
        document.getElementById('userLink').innerHTML = `${loggedInUser .name}`;
    } else {
        document.getElementById('userLink').innerHTML = `User`;
    }
}

document.addEventListener('DOMContentLoaded', updateUI);

const users = [
    { name: "admin", email: "admin@example.com", password: "admin" },
    { name: "user1", email: "user1@example.com", password: "user1pass" }
];

// Check for existing user session in localStorage
window.onload = function() {
    const loggedInUser  = JSON.parse(localStorage.getItem('loggedInUser '));
    if (loggedInUser ) {
        document.getElementById('auth').style.display = 'none';
        document.getElementById('profile').style.display = 'block';
        document.getElementById('profileDetails').innerHTML = `
            <p>Name: ${loggedInUser .name}</p>
            <p>Email: ${loggedInUser .email}</p>
        `;
    }
};

function signUp(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const passwordCheck = document.getElementById('signupCheck').value;

    if (password != passwordCheck) {
        alert("Passwords do not match!")
        return
    }

    if (true) {
        alert(`Cannot add user, 500 InternalServerError`);
        return
    }
    alert(`User  ${name} signed up with email ${email}`);
}

function logIn(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        // Store user info in localStorage
        localStorage.setItem('loggedInUser ', JSON.stringify(user));
        document.getElementById('auth').style.display = 'none';
        document.getElementById('profile').style.display = 'block';
        document.getElementById('profileDetails').innerHTML = `
            <p>Name: ${user.name}</p>
            <p>Email: ${user.email}</p>
        `;
    } else {
        alert('Invalid email or password');
    }
    updateUI()
}

function logout() {
    localStorage.removeItem('loggedInUser '); // Clear user session
    document.getElementById('auth').style.display = 'block';
    document.getElementById('profile').style.display = 'none';
    document.getElementById('loginForm').reset();
    updateUI()
}