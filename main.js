let balance = 100;
let bet = 0;
let multiplier = 1.00;
let gameRunning = false;
let interval;

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('cashOutBtn').addEventListener('click', cashOut);
document.getElementById('addBalanceBtn').addEventListener('click', addBalance);

// Show loading text initially
document.getElementById('balance').textContent = "$Loading...";

// Fetch balance from JSON server
async function fetchBalance() {
    try {
        let response = await fetch("http://localhost:3000/balance");
        let data = await response.json();
        balance = data || 100; // Default to 100 if no data found
    } catch (error) {
        console.error("Error fetching balance:", error);
        balance = 100; // Default to 100 if fetch fails
    }
    updateBalance();
}

// Update balance on UI and server
async function updateBalance() {
    document.getElementById('balance').textContent = `${balance.toFixed(2)}`;

    try {
        await fetch("http://localhost:3000/balance", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({balance})
        });
    } catch (error) {
        console.error("Error updating balance:", error);
    }
}

// Start game logic
function startGame() {
    bet = parseFloat(document.getElementById('betAmount').value);
    if (isNaN(bet) || bet <= 0 || bet > balance) {
        alert("Invalid bet amount!");
        return;
    }

    balance -= bet;
    updateBalance();
    document.getElementById('message').textContent = "Game Started!";
    document.getElementById('startBtn').disabled = true;
    document.getElementById('cashOutBtn').disabled = false;

    multiplier = 1.00;
    gameRunning = true;
    interval = setInterval(() => {
        multiplier += Math.random() * 0.1;
        document.getElementById('multiplier').textContent = `Multiplier: ${multiplier.toFixed(2)}x`;

        if (Math.random() < 0.03) { // 3% chance of crashing per tick
            crashGame();
        }
    }, 500);
}

// Cash out winnings
async function cashOut() {
    if (!gameRunning) return;

    let winnings = bet * multiplier;
    balance += winnings;
    document.getElementById('message').textContent = `Cashed out at ${multiplier.toFixed(2)}x! Won $${winnings.toFixed(2)}`;
    
    await saveBetHistory("win", multiplier, winnings);
    stopGame();
}

// Handle game crash
async function crashGame() {
    document.getElementById('message').textContent = `Crashed at ${multiplier.toFixed(2)}x! You lost $${bet.toFixed(2)}`;
    await saveBetHistory("loss", multiplier, bet);
    stopGame();
}

// Stop the game and reset UI
function stopGame() {
    clearInterval(interval);
    gameRunning = false;
    document.getElementById('startBtn').disabled = false;
    document.getElementById('cashOutBtn').disabled = true;
    updateBalance();
}

// Save bet history to JSON server
async function saveBetHistory(result, multiplier, amount) {
    let betRecord = {
        result: result,
        multiplier: multiplier.toFixed(2),
        amount: amount.toFixed(2),
        timestamp: new Date().toISOString()
    };

    try {
        await fetch("http://localhost:3000/betHistory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(betRecord)
        });
    } catch (error) {
        console.error("Error saving bet history:", error);
    }
}

// Add funds to balance
async function addBalance() {
    let addAmount = parseFloat(document.getElementById('addBalanceAmount').value);
    if (isNaN(addAmount) || addAmount <= 0) {
        alert("Enter a valid amount!");
        return;
    }

    balance += addAmount;
    await updateBalance();
    document.getElementById('addBalanceAmount').value = "";
}

// Fetch balance when the page loads
fetchBalance();
