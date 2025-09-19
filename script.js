document.addEventListener('DOMContentLoaded', () => {

    // Admin bejelentkezés modal kezelése
    const settingsBtn = document.getElementById('settings-btn');
    const modal = document.getElementById('settings-modal');
    const closeBtn = document.querySelector('.close-btn');
    const adminLoginForm = document.getElementById('admin-login-form');
    const loginError = document.getElementById('login-error');

    settingsBtn.onclick = () => {
        modal.style.display = 'flex';
        loginError.textContent = '';
    };

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;

        const staff = {
            'admin': 'shadowrealms',
            'mod': 'jelszo123'
        };

        if (staff[username] === password) {
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'admin.html';
        } else {
            loginError.textContent = 'Hibás felhasználónév vagy jelszó.';
        }
    });


    // Hírek dinamikus betöltése a localStorage-ból (Javítva: 'posts' kulcsot használ)
    const postsContainer = document.getElementById('posts-container');
    
    function loadPosts() {
        // A 'posts' kulcsot olvassa ki, ahogy az admin.js is írja
        let posts = JSON.parse(localStorage.getItem('posts')) || [];

        if (posts.length === 0) {
            postsContainer.innerHTML = '<p>Jelenleg nincsenek friss hírek.</p>';
            return;
        }

        postsContainer.innerHTML = '';
        posts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.className = 'post-card';
            postCard.innerHTML = `
                <h4>${post.title}</h4>
                <p class="post-meta">${new Date(post.date).toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p>${post.content}</p>
            `;
            postsContainer.appendChild(postCard);
        });
    }

    loadPosts();


    // Valós szerverstátusz ellenőrzése egy API segítségével
    const serverIP = 'shadowrealms.sytes.net'; 
    const serverStatusDot = document.getElementById('server-status');
    const statusText = document.getElementById('status-text');
    const playerCount = document.getElementById('player-count');
    const maxPlayers = document.getElementById('max-players');
    
    fetch(`https://api.mcsrvstat.us/2/${serverIP}`)
        .then(response => response.json())
        .then(data => {
            if (data.online) {
                serverStatusDot.classList.remove('offline');
                serverStatusDot.classList.add('online');
                statusText.classList.remove('offline');
                statusText.classList.add('online');
                statusText.textContent = 'ONLINE';
                playerCount.textContent = data.players.online;
                maxPlayers.textContent = data.players.max;
            } else {
                serverStatusDot.classList.remove('online');
                serverStatusDot.classList.add('offline');
                statusText.classList.remove('online');
                statusText.classList.add('offline');
                statusText.textContent = 'OFFLINE';
                playerCount.textContent = '0';
                maxPlayers.textContent = '0';
            }
        })
        .catch(error => {
            console.error('Hiba a szerverstátusz lekérdezésekor:', error);
            serverStatusDot.classList.remove('online');
            serverStatusDot.classList.add('offline');
            statusText.classList.remove('online');
            statusText.classList.add('offline');
            statusText.textContent = 'OFFLINE';
            playerCount.textContent = '0';
            maxPlayers.textContent = '0';
        });

});
