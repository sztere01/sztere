document.addEventListener('DOMContentLoaded', () => {

    // Ezt a funkciót hívja meg a szabályzat oldalon lévő tab gombok "onclick" eseménye.
    window.openTab = function(evt, tabName) {
        let i, tabcontent, tablinks;

        tabcontent = document.getElementsByClassName("rules-tab-content");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        tablinks = document.getElementsByClassName("tab-button");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }

    // A bejelentkezés gomb funkciója, ami a rules.html oldalon is van
    const settingsBtn = document.getElementById('settings-btn');
    const modal = document.getElementById('settings-modal');
    const closeBtn = document.querySelector('.close-btn');

    settingsBtn.onclick = () => {
        modal.style.display = 'flex';
    };

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});