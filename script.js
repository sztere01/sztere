document.addEventListener('DOMContentLoaded', () => {
    // Tab navigáció
    const tabLinks = document.querySelectorAll('.tab-nav a');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links and contents
            tabLinks.forEach(item => item.classList.remove('active'));
            tabContents.forEach(content => {
                content.classList.remove('active');
                // Ha van más animációs osztály, azt is távolítsd el, hogy újra lefusson
                content.classList.remove('fadeInScale');
            });

            // Add active class to the clicked link
            e.target.classList.add('active');

            // Show the corresponding tab content and re-apply animation
            const targetId = e.target.getAttribute('href').substring(1);
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                // Kicsi késleltetés, hogy a CSS animáció újra elinduljon
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        targetContent.classList.add('active');
                    });
                });
            }
        });
    });

    // Kezdeti állapot beállítása: aktív tab a "FŐOLDAL"
    const initialTab = document.querySelector('.tab-nav a[href="#home"]');
    if (initialTab) {
        initialTab.click();
    }


    // IP másolása gomb
    const copyIpBtn = document.getElementById('copy-ip-btn');
    const serverIpSpan = document.getElementById('server-ip');

    if (copyIpBtn && serverIpSpan) {
        copyIpBtn.addEventListener('click', () => {
            const ipAddress = serverIpSpan.textContent;
            navigator.clipboard.writeText(ipAddress)
                .then(() => {
                    copyIpBtn.textContent = 'Másolva!';
                    setTimeout(() => {
                        copyIpBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Másolás';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy IP: ', err);
                    alert('Sikertelen másolás! Kérjük, másolja kézzel az IP címet: ' + ipAddress);
                });
        });
    }

    // Modal kezelés (Bejelentkezés/Regisztráció)
    const authModal = document.getElementById('auth-modal');
    const closeButton = document.querySelector('.close-button');
    const showLoginTab = document.getElementById('show-login-tab');
    const showRegisterTab = document.getElementById('show-register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showLoginLinkFromRegister = document.querySelector('.show-login-link-from-register');

    const closeAuthModal = () => {
        authModal.classList.remove('active');
    };

    if (closeButton) {
        closeButton.addEventListener('click', closeAuthModal);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && authModal.classList.contains('active')) {
            closeAuthModal();
        }
    });

    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                closeAuthModal();
            }
        });
    }

    const showLoginForm = () => {
        if (showLoginTab && showRegisterTab && loginForm && registerForm) {
            showLoginTab.classList.add('active');
            showRegisterTab.classList.remove('active');
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        }
    };

    const showRegisterForm = () => {
        if (showLoginTab && showRegisterTab && loginForm && registerForm) {
            showRegisterTab.classList.add('active');
            showLoginTab.classList.remove('active');
            registerForm.style.display = 'block';
            loginForm.style.display = 'none';
        }
    };

    if (showLoginTab) {
        showLoginTab.addEventListener('click', showLoginForm);
    }
    if (showRegisterTab) {
        showRegisterTab.addEventListener('click', showRegisterForm);
    }
    if (showLoginLinkFromRegister) {
        showLoginLinkFromRegister.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginForm();
        });
    }

    const loginSubmitBtn = document.querySelector('.login-submit-btn');
    const registerSubmitBtn = document.querySelector('.register-submit-btn');

    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener('click', () => {
            alert('Bejelentkezés demó funkció. Valós bejelentkezéshez backend szükséges!');
            closeAuthModal();
        });
    }

    if (registerSubmitBtn) {
        registerSubmitBtn.addEventListener('click', () => {
            alert('Regisztráció demó funkció. Valós regisztrációhoz backend szükséges!');
            closeAuthModal();
        });
    }

    // Minecraft szerver státusz frissítése valós API hívással
    const updateServerStatus = async () => {
        const playerCountElement = document.getElementById('player-count');
        const serverStatusTextElement = document.getElementById('server-status-text');
        const statusIndicator = document.querySelector('.status-indicator');
        const serverIp = document.getElementById('server-ip').textContent; // Get the IP from the HTML

        // Use a proxy or a CORS-enabled API to fetch server status
        // mcsrvstat.us is a good public option for this, they handle CORS
        const apiUrl = `https://api.mcsrvstat.us/2/${serverIp}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.online) {
                const playersOnline = data.players ? data.players.online : 0;
                const playersMax = data.players ? data.players.max : 200; // Default max players if not provided
                playerCountElement.textContent = playersOnline;
                serverStatusTextElement.innerHTML = `SERVER STATUS: ONLINE (${playersOnline}/${playersMax} Players)`;
                statusIndicator.classList.remove('offline');
                statusIndicator.classList.add('online');
            } else {
                playerCountElement.textContent = '0';
                serverStatusTextElement.innerHTML = `SERVER STATUS: OFFLINE`;
                statusIndicator.classList.remove('online');
                statusIndicator.classList.add('offline');
            }
        } catch (error) {
            console.error('Error fetching server status:', error);
            // Fallback to offline/error state if API call fails
            playerCountElement.textContent = '0';
            serverStatusTextElement.innerHTML = `SERVER STATUS: OFFLINE (Error)`;
            statusIndicator.classList.remove('online');
            statusIndicator.classList.add('offline');
        }
    };

    updateServerStatus();
    setInterval(updateServerStatus, 60000); // Frissítés minden percben
});