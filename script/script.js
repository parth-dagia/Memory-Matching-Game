document.addEventListener('DOMContentLoaded', () => {
    const cards = [
        'A', 'A', 'ᗺ', 'ᗺ', 'Ɔ', 'Ɔ', 'ᗡ', 'ᗡ',
        'Ǝ', 'Ǝ', 'ꟻ', 'ꟻ', 'I', 'I', 'H', 'H'
    ];

    const gameBoard = document.getElementById('game-board');
    const startGameButton = document.getElementById('start-game-button');
    const resetButton = document.getElementById('reset-button');
    const newGameButton = document.getElementById('new-game-button');
    const usernameInput = document.getElementById('username');
    const leaderboardList = document.getElementById('leaderboard-list');

    let firstCard = null;
    let secondCard = null;
    let score = 0;
    let time = 0;
    let timerInterval;
    let username = '';
    let isProcessing = false;  

    
    const leaderboard = [
        { name: 'test1', score: 35 },
        { name: 'test2', score: 48 },
        { name: 'test3', score: 44 }
    ];

    function updateLeaderboard() {
        leaderboardList.innerHTML = '';

        leaderboard.push({ name: username, score: time });
        
        
        leaderboard.sort((a, b) => a.score - b.score);

        
        leaderboard.forEach(player => {
            const listItem = document.createElement('li');
            listItem.textContent = `${player.name}: ${player.score}s`;
            leaderboardList.appendChild(listItem);
        });
    }

    function initializeLeaderboard() {
        
        leaderboard.sort((a, b) => b.score - a.score);

       
        leaderboard.forEach(player => {
            const listItem = document.createElement('li');
            listItem.textContent = `${player.name}: ${player.score}s`;
            leaderboardList.appendChild(listItem);
        });
    }

    startGameButton.addEventListener('click', () => {
        username = usernameInput.value.trim();
        if (username) {
            document.getElementById('registration').classList.add('hidden');
            gameBoard.classList.remove('hidden');
            document.querySelector('.controls').classList.remove('hidden');
            startGame();
        } else {
            alert('Please enter your name to start the game.');
        }
    });

    resetButton.addEventListener('click', startGame);

    newGameButton.addEventListener('click', () => {
       
        document.getElementById('registration').classList.remove('hidden');
        gameBoard.classList.add('hidden');
        document.querySelector('.controls').classList.add('hidden');
        usernameInput.value = ''; 
        leaderboardList.innerHTML = ''; 
        initializeLeaderboard(); 
    });

    function startGame() {
        shuffle(cards);
        createBoard();
        score = 0;
        time = 0;
        updateScore();
        updateTime();
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            time++;
            updateTime();
        }, 1000);
    }

    function createBoard() {
        gameBoard.innerHTML = '';
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.value = card;
            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
        });
    }

    function flipCard() {
        if (isProcessing || this === firstCard || this.classList.contains('matched') || this.classList.contains('flipped')) return;

        this.textContent = this.dataset.value;
        this.classList.add('flipped');

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        isProcessing = true; 
    
        if (firstCard.dataset.value === secondCard.dataset.value) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            score++;
            updateScore();
            resetFlip();
            if (score === cards.length / 2) {
                clearInterval(timerInterval);
                updateLeaderboard();
            }
            isProcessing = false; 
        } else {
            firstCard.classList.add('unmatched');
            secondCard.classList.add('unmatched');
            setTimeout(() => {
                firstCard.textContent = '';
                secondCard.textContent = '';
                firstCard.classList.remove('unmatched', 'flipped');
                secondCard.classList.remove('unmatched', 'flipped');
                resetFlip();
                isProcessing = false;  
            }, 500);
        }
    }
    
    function resetFlip() {
        [firstCard, secondCard] = [null, null];
    }

    function updateScore() {
        document.getElementById('score').textContent = score;
    }

    function updateTime() {
        document.getElementById('timer').textContent = time;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

   
    initializeLeaderboard();
});
