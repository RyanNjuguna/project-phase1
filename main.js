let balance = parseFloat(localStorage.getItem("balance")) || 100;
        let bet = 0;
        let multiplier = 1.00;
        let gameRunning = false;
        let interval;

        document.getElementById('startBtn').addEventListener('click', startGame);
        document.getElementById('cashOutBtn').addEventListener('click', cashOut);
        document.getElementById('addBalanceBtn').addEventListener('click', addBalance);

        function updateBalance() {
            document.getElementById('balance').textContent = balance.toFixed(2);
            localStorage.setItem("balance", balance);
        }

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

        function cashOut() {
            if (!gameRunning) return;

            let winnings = bet * multiplier;
            balance += winnings;
            document.getElementById('message').textContent = `Cashed out at ${multiplier.toFixed(2)}x! Won $${winnings.toFixed(2)}`;
            
            stopGame();
        }

        function crashGame() {
            document.getElementById('message').textContent = `Crashed at ${multiplier.toFixed(2)}x! You lost $${bet.toFixed(2)}`;
            stopGame();
        }

        function stopGame() {
            clearInterval(interval);
            gameRunning = false;
            document.getElementById('startBtn').disabled = false;
            document.getElementById('cashOutBtn').disabled = true;
            updateBalance();
        }

        function addBalance() {
            let addAmount = parseFloat(document.getElementById('addBalanceAmount').value);
            if (isNaN(addAmount) || addAmount <= 0) {
                alert("Enter a valid amount!");
                return;
            }

            balance += addAmount;
            updateBalance();
            document.getElementById('addBalanceAmount').value = "";
        }

        // Load balance when page loads
        updateBalance();