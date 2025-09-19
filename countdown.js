// A cél dátum: 2025. október 18., éjfél (magyar idő szerint)
const countdownDate = new Date("October 18, 2025 00:00:00 GMT+02:00").getTime();

const x = setInterval(function() {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (document.getElementById("countdown")) {
        document.getElementById("countdown").innerHTML = `${days} nap ${hours} óra ${minutes} perc ${seconds} másodperc`;
    }

    if (distance < 0) {
        clearInterval(x);
        if (document.getElementById("countdown")) {
            document.getElementById("countdown").innerHTML = "A weboldal megnyílt!";
        }
        window.location.href = "main.html";
    }
}, 1000);

const settingsBtn = document.getElementById('settings-btn');
const modal = document.getElementById('settings-modal');
const closeBtn = document.querySelector('.close-btn');
const loginForm = document.getElementById('admin-login-form');
const errorMsg = document.getElementById('login-error');

const adminUser = "admin";
const adminPass = "shadowrealms2024";

if (settingsBtn) {
    settingsBtn.onclick = function(e) {
        e.preventDefault();
        modal.style.display = "flex";
    };
}

if (closeBtn) {
    closeBtn.onclick = function() {
        modal.style.display = "none";
        errorMsg.textContent = "";
    };
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        errorMsg.textContent = "";
    }
};

if (loginForm) {
    loginForm.onsubmit = function(event) {
        event.preventDefault();
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;

        if (username === adminUser && password === adminPass) {
            localStorage.setItem('isLoggedIn', 'true');
            alert("Sikeres bejelentkezés! Mostantól szerkesztheted az oldalt.");
            window.location.href = "main.html";
        } else {
            errorMsg.textContent = "Helytelen felhasználónév vagy jelszó.";
            errorMsg.style.display = "block";
        }
    };
}