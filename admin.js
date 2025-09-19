document.addEventListener('DOMContentLoaded', () => {
    // Belépés ellenőrzése
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'main.html';
        return;
    }

    const voteForm = document.getElementById('vote-form');
    const voteQuestionInput = document.getElementById('vote-question-input');
    const voteOption1Input = document.getElementById('vote-option1-input');
    const voteOption2Input = document.getElementById('vote-option2-input');
    const currentVoteResultsEl = document.getElementById('current-vote-results');
    const logoutBtn = document.getElementById('logout-btn');
    const deleteVoteBtn = document.getElementById('delete-vote-btn');

    const postForm = document.getElementById('post-form');
    const postTitleInput = document.getElementById('post-title-input');
    const postContentInput = document.getElementById('post-content-input');
    const editablePostsContainer = document.getElementById('editable-posts-container');

    // Szavazás közzététele
    if (voteForm) {
        voteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newVoteData = {
                question: voteQuestionInput.value,
                options: [
                    { id: 0, text: voteOption1Input.value, votes: 0 },
                    { id: 1, text: voteOption2Input.value, votes: 0 }
                ]
            };
            localStorage.setItem('voteData', JSON.stringify(newVoteData));
            localStorage.removeItem('hasVoted');
            alert("Az új szavazás sikeresen közzétéve!");
            displayAdminResults();
            voteForm.reset();
        });
    }

    // Aktuális eredmények megjelenítése
    function displayAdminResults() {
        const voteData = JSON.parse(localStorage.getItem('voteData'));
        if (!voteData || !voteData.question) {
            currentVoteResultsEl.innerHTML = '<p>Nincs aktív szavazás.</p>';
            return;
        }

        const totalVotes = voteData.options.reduce((sum, option) => sum + option.votes, 0);
        
        let resultsHtml = `<h3>${voteData.question}</h3><p>Összes szavazat: ${totalVotes}</p>`;
        
        voteData.options.forEach(option => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            resultsHtml += `
                <div class="result-bar-container">
                    <div class="result-bar" style="width: ${percentage}%"></div>
                    <span class="result-label">${option.text}</span>
                    <p>${option.votes} (${percentage.toFixed(1)}%)</p>
                </div>
            `;
        });
        currentVoteResultsEl.innerHTML = resultsHtml;
    }

    // Szavazás törlése
    if (deleteVoteBtn) {
        deleteVoteBtn.addEventListener('click', () => {
            if (confirm("Biztosan törölni szeretnéd a szavazást?")) {
                localStorage.removeItem('voteData');
                localStorage.removeItem('hasVoted');
                alert("A szavazás sikeresen törölve.");
                displayAdminResults();
            }
        });
    }

    // Hír posztolása
    if (postForm) {
        postForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newPost = {
                id: Date.now(),
                title: postTitleInput.value,
                content: postContentInput.value,
                date: new Date().toISOString()
            };
            const posts = JSON.parse(localStorage.getItem('posts')) || [];
            posts.unshift(newPost); // Új bejegyzés az elejére
            localStorage.setItem('posts', JSON.stringify(posts));
            alert('A hír sikeresen közzétéve!');
            postForm.reset();
            displayEditablePosts();
        });
    }

    // Hírek megjelenítése és kezelése (törlés)
    function displayEditablePosts() {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        if (posts.length === 0) {
            editablePostsContainer.innerHTML = '<p>Nincs közzétett hír.</p>';
            return;
        }

        editablePostsContainer.innerHTML = '';
        posts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.classList.add('post-card');
            postCard.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <div class="admin-buttons">
                    <button class="cta-button delete-post-btn" data-id="${post.id}">Törlés</button>
                </div>
            `;
            editablePostsContainer.appendChild(postCard);
        });

        document.querySelectorAll('.delete-post-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const postId = parseInt(e.target.dataset.id);
                deletePost(postId);
            });
        });
    }

    function deletePost(postId) {
        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts = posts.filter(post => post.id !== postId);
        localStorage.setItem('posts', JSON.stringify(posts));
        alert('A hír sikeresen törölve!');
        displayEditablePosts();
    }

    // Kijelentkezés
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'main.html';
        });
    }

    displayAdminResults();
    displayEditablePosts();
});