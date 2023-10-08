let gameNumber = 0;

    let pieChart;

    let doors = ['goat', 'goat', 'car'];
    let playerChoice = null;
    let montyChoice = null;
    let playerSwitchChoice = null;
    let switchWins = 0;
    let totalSwitches = 0;
    let secondTurn = false;
    let gameStarted = false;
    let switchWinsCount = 0;
  let switchedAndWon = false; // New variable to track if switched and won

    function montyHallSimulation() {
      if (gameStarted) return;

      for (let i = doors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [doors[i], doors[j]] = [doors[j], doors[i]];
      }

      gameStarted = true;
    }

    function chooseDoor(choice) {
      if (!gameStarted) {
        montyHallSimulation();
        document.getElementById('result').textContent = '';
        document.getElementById('try-again').style.display = 'none';
        document.getElementById('percentage').style.display = 'none';
      }

      
    if (secondTurn) {
      if (choice === playerChoice) {
        playerSwitchChoice = playerChoice; // Staying with the same door
        switchedAndWon = false; // Reset switch win flag
      } else if (choice !== montyChoice) {
        playerSwitchChoice = choice; // Switching to the other unopened door
        switchedAndWon = doors[playerSwitchChoice] === 'car'; // Set switch win flag
      } else {
        switchedAndWon = false; // Reset switch win flag
        return;
      }
    } else {
      playerChoice = choice; // Set the player's initial choice
    }

      montyChoice = doors.findIndex((door, index) => index !== playerChoice && door === 'goat');
      updateDoorsDisplay();

      if (secondTurn) {
        document.getElementById('result').textContent = "You've chosen to switch. Wait for the result...";
        setTimeout(revealResult, 2000);
      } else {
        secondTurn = true;
        document.getElementById('result').textContent = "The goat has been shown. Select one of the remaining doors?";
      }
    }

    function updateDoorsDisplay() {
      const doorElements = document.querySelectorAll('.door');
      doorElements.forEach((doorElement, index) => {
        doorElement.classList.remove('selected', 'opened', 'car', 'goat', 'which');

        if (index === playerChoice || index === playerSwitchChoice) {
          doorElement.classList.add('selected');
        } else if (index === montyChoice) {
          if (doors[montyChoice] === 'goat') {
            doorElement.textContent = 'Goat';
          } else {
            doorElement.classList.add('opened');
          }
        }
        if (doors[index] === 'car') {
          doorElement.classList.add('car');
        } else {
          doorElement.classList.add('goat');
        }
      });
    }

    
    function revealResult() {
    const resultElement = document.getElementById('result');
    const tryAgainButton = document.getElementById('try-again');
    const tryAgainContainer = document.getElementById('try-again-container');
    const percentageElement = document.getElementById('percentage');
    const winCountElement = document.getElementById('win-count'); // New element

    resultElement.innerHTML = '';

    if (doors[playerSwitchChoice] === 'car' && switchedAndWon) {
      resultElement.innerHTML += '<p>Congratulations! You won the car by switching!</p>';
      switchWinsCount++; // Increment switch wins count
    } else if (doors[playerChoice] === 'car' && !switchedAndWon) {
      resultElement.innerHTML += '<p>Congratulations! You won the car by sticking!</p>';
    } else {
      resultElement.innerHTML += '<p>Sorry, you got a goat.</p>';
    }

      resultElement.innerHTML += `<p>The car was behind ${doors.findIndex(door => door === 'car') + 1}.</p>`;

      totalSwitches++;
      gameStarted = false;
      secondTurn = false;
      tryAgainButton.style.display = 'block';
      tryAgainContainer.style.display = 'flex';
      updatePercentage();
      disableDoors();

      const pieChartContainer = document.getElementById('pie-chart-container');
      pieChartContainer.style.display = 'block';
      updatePieChart((switchWins / totalSwitches) * 100);

      winCountElement.textContent = `Wins by switching: ${switchWinsCount}`; // Update switch wins count display
  }

    function updatePercentage() {
      const percentageElement = document.getElementById('percentage');
      if (totalSwitches > 0) {
        const winPercentage = ((switchWins / totalSwitches) * 100).toFixed(2);
        percentageElement.textContent = `Percentage of wins: ${winPercentage}%`;
        percentageElement.style.display = 'block';
        updatePieChart(winPercentage);
      } else {
        percentageElement.style.display = 'none';
      }
    }

    function disableDoors() {
      const doorElements = document.querySelectorAll('.door');
      doorElements.forEach((doorElement) => {
        doorElement.style.pointerEvents = 'none';
      });
    }

    function enableDoors() {
      const doorElements = document.querySelectorAll('.door');
      doorElements.forEach((doorElement) => {
        doorElement.style.pointerEvents = 'auto';
      });
    }

    function resetGame() {
      doors = ['goat', 'goat', 'car'];
      playerChoice = null;
      montyChoice = null;
      playerSwitchChoice = null;
      secondTurn = false;
      gameStarted = false;

      document.getElementById('result').textContent = '';
      document.getElementById('try-again').style.display = 'none';
      document.getElementById('try-again-container').style.display = 'none';
      updateDoorsDisplay();
      enableDoors();

      const doorElements = document.querySelectorAll('.door');
      doorElements.forEach((doorElement, index) => {
        doorElement.textContent = `Door ${index + 1}`;
        doorElement.classList.remove('selected', 'opened', 'car', 'goat', 'which');
      });
    }

    initPieChart();

    function initPieChart() {
      const pieChartCanvas = document.getElementById('winPercentageChart');
      const ctx = pieChartCanvas.getContext('2d');

      pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Wins', 'Losses'],
          datasets: [{
            data: [0, 100],
            backgroundColor: ['green', 'red'],
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: true,
            position: 'bottom',
          },
        },
      });
    }

    function updatePieChart(winPercentage) {
      const stayWinPercentage = 100 - winPercentage;

      pieChart.data.datasets[0].data = [winPercentage, stayWinPercentage];
      pieChart.update();
    }

    function toggleMode() {
      const body = document.body;
      body.classList.toggle('dark-mode');

      // Toggle dark mode for the history panel
      const historyPanel = document.getElementById('history');
      historyPanel.classList.toggle('dark-mode');

      // Toggle dark mode for the "Learn about Monty Hall problem" tab and tooltip
      const infoIcon = document.getElementById('info-icon');
      infoIcon.classList.toggle('dark-mode');
      const tooltip = infoIcon.querySelector('.tooltip');
      tooltip.classList.toggle('dark-mode');

      // Toggle dark mode for the popup overlay and content
      const popupOverlay = document.getElementById('popup-overlay');
      popupOverlay.classList.toggle('dark-mode');
      const popupContent = document.getElementById('popup-content');
      popupContent.classList.toggle('dark-mode');
    }
    


    const modeSwitch = document.getElementById('toggle-mode');
    modeSwitch.addEventListener('change', toggleMode);


    



    

    function recordGameHistory(won, switched) {
  gameNumber++; // Increment the game number
  const history = document.getElementById('game-history-list');
  const historyItem = document.createElement('div');
  historyItem.classList.add('history-item');

  const result = won ? 'Won' : 'Lost';
  const switchInfo = switched ? `(${switched === 'switched' ? 'Switched' : 'Stayed'})` : '';

  historyItem.innerHTML = `<p>Game ${gameNumber}: Result: ${result} ${switchInfo}</p><hr>`;
  history.appendChild(historyItem); // Add the new history item at the end

  // Scroll the history panel to the bottom to show the latest entry
  history.scrollTop = history.scrollHeight;
}





function revealResult() {
  const resultElement = document.getElementById('result');
  const tryAgainButton = document.getElementById('try-again');
  const tryAgainContainer = document.getElementById('try-again-container');
  const percentageElement = document.getElementById('percentage');

  resultElement.innerHTML = '';

  if (doors[playerSwitchChoice] === 'car') {
    resultElement.innerHTML += '<p>Congratulations! You won the car!</p>';
    switchWins++;
    recordGameHistory(true, playerSwitchChoice ? 'switched' : 'stayed'); // Fix this line
  } else {
    resultElement.innerHTML += '<p>Sorry, you got a goat.</p>';
    recordGameHistory(false, playerSwitchChoice ? 'switched' : 'stayed'); // Fix this line
  }


  resultElement.innerHTML += `<p>The car was behind ${doors.findIndex(door => door === 'car') + 1}.</p>`;

  totalSwitches++;
  gameStarted = false;
  secondTurn = false;
  tryAgainButton.style.display = 'block';
  tryAgainContainer.style.display = 'flex';
  updatePercentage();
  disableDoors();

  const pieChartContainer = document.getElementById('pie-chart-container');
  pieChartContainer.style.display = 'block';
  updatePieChart((switchWins / totalSwitches) * 100);
}


function toggleHistoryPanel() {
    const historyPanel = document.getElementById('history');
    const toggleBtn = document.getElementById('toggle-history-btn');

    if (historyPanel.style.width === '0%' || historyPanel.style.width === '') {
        historyPanel.style.width = '25%';
        historyPanel.style.display = 'block';
        toggleBtn.textContent = 'Hide';
    } else {
        historyPanel.style.width = '0%';
        historyPanel.style.display = 'none';
        toggleBtn.textContent = 'Show History';
    }
}


    const infoIcon = document.getElementById('info-icon');
const popupOverlay = document.getElementById('popup-overlay');
const closePopupButton = document.getElementById('close-popup');

infoIcon.addEventListener('click', () => {
  popupOverlay.style.display = 'block';
});

closePopupButton.addEventListener('click', () => {
  popupOverlay.style.display = 'none';
});
