
function showLoginModal() {
    const username = prompt("Enter username:");
    const password = prompt("Enter password:");

    if (username === "admin" && password === "admin") {
        localStorage.setItem("user", username);
        updateUI();
    } else {
        alert("Invalid credentials. Please try again.");
    }
}

function logout() {
    localStorage.removeItem("user");
    updateUI();
}

function updateUI() {
    const user = localStorage.getItem("user");
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (user) {
        loginBtn.style.display = "none";
        logoutBtn.style.display = "block";
    } else {
        loginBtn.style.display = "block";
        logoutBtn.style.display = "none";
    }
}

window.onload = updateUI;