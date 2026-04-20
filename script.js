let player = "";
let avatar = "👧";
let score = 0;
let level = 1;
let time = 30;
let timer;
let first = null;
let second = null;
let lock = false;
let matches = 0;

let emojis = ["🍓","🍩","🍭","🍒","🍉","🍪","🍫","🍬","🍇","🥝"];

// SELECT AVATAR
function selectAvatar(a) {
    avatar = a;
    document.getElementById("chosenAvatar").innerText = "Avatar: " + avatar;
}

// START GAME
function startGame() {
    player = document.getElementById("playerName").value;
    if (player === "") {
        alert("Enter your name!");
        return;
    }

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("gamePage").style.display = "block";

    document.getElementById("playerDisplay").innerText = avatar + " " + player;

    level = 1;
    score = 0;
    setupLevel();
}

// LOGOUT
function logout() {
    document.getElementById("gamePage").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
}

// SETUP LEVEL
function setupLevel() {
    clearInterval(timer);
    matches = 0;
    time = 30 - level * 2;
    if (time < 10) time = 10;

    updateInfo();

    let pairCount = level + 2;
    let selected = emojis.slice(0, pairCount);
    let cards = [...selected, ...selected].sort(() => 0.5 - Math.random());

    let grid = document.getElementById("grid");
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${Math.min(4, pairCount)}, 1fr)`;

    cards.forEach(symbol => {
        let div = document.createElement("div");
        div.classList.add("cardBox");
        div.innerText = symbol;
        div.onclick = () => flipCard(div, symbol);
        grid.appendChild(div);
    });

    startTimer();
}

// FLIP CARD
function flipCard(card, symbol) {
    if (lock || card.classList.contains("revealed")) return;

    document.getElementById("flipSound").play();
    card.classList.add("revealed");

    if (!first) {
        first = {card, symbol};
    } else {
        second = {card, symbol};
        lock = true;

        if (first.symbol === second.symbol) {
            document.getElementById("matchSound").play();
            matches++;
            score += 10;
            resetTurn();

            if (matches === (level + 2)) {
                clearInterval(timer);
                score += 20;
                saveScore();

                setTimeout(() => {
                    level++;
                    setupLevel();
                }, 500);
            }
        } else {
            setTimeout(() => {
                first.card.classList.remove("revealed");
                second.card.classList.remove("revealed");
                resetTurn();
            }, 700);
        }
    }
}

function resetTurn() {
    first = null;
    second = null;
    lock = false;
}

// TIMER
function startTimer() {
    timer = setInterval(() => {
        time--;
        updateInfo();

        if (time <= 0) {
            clearInterval(timer);
            saveScore();
            alert("⏰ Game Over!");
            showLeaderboard();
        }
    }, 1000);
}

// UPDATE INFO
function updateInfo() {
    document.getElementById("info").innerText =
        "Level: " + level + " | Time: " + time + " | Score: " + score;
}

// SAVE SCORE + LEADERBOARD
function saveScore() {
    let data = JSON.parse(localStorage.getItem("leaderboard")) || [];

    data.push({
        name: player,
        avatar: avatar,
        score: score
    });

    data.sort((a, b) => b.score - a.score);
    data = data.slice(0, 5);

    localStorage.setItem("leaderboard", JSON.stringify(data));
}

// SHOW LEADERBOARD
function showLeaderboard() {
    document.getElementById("gamePage").style.display = "none";
    document.getElementById("leaderboardPage").style.display = "block";

    let list = document.getElementById("leaderboardList");
    list.innerHTML = "";

    let data = JSON.parse(localStorage.getItem("leaderboard")) || [];

    data.forEach(player => {
        let li = document.createElement("li");
        li.innerText = player.avatar + " " + player.name + " - " + player.score;
        list.appendChild(li);
    });
}

// BACK TO GAME
function backToGame() {
    document.getElementById("leaderboardPage").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
}

// THEMES
function changeTheme(theme) {
    document.getElementById("body").className = theme;
}

// default
changeTheme("pink");