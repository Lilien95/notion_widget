document.addEventListener('DOMContentLoaded', initialize);

const POMODORO_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;
const WAVES = document.querySelectorAll('.wave');
const RING = new Audio('../assets/ring.mp3'); // dźwięk po zakończeniu odliczania
const BEEP = new Audio('../assets/beep.mp3'); // dźwięk odliczania końcowych sekund

let currentMode = 'pomodoro'; // Domyślny tryb to pomodoro
let timer; // Przechowuje ID timera
let timeLeft = POMODORO_TIME; // Czas pozostały do końca
let isRunning = false; // Czy timer jest obecnie uruchomiony

function initialize() {
    const counterDisplay = document.getElementById('counter');
    const startButton = document.getElementById('control_start');
    const resetButton = document.getElementById('control_reset');
    const pomodoroButton = document.getElementById('menu_pomodoro');
    const shortBreakButton = document.getElementById('menu_short_break');
    const longBreakButton = document.getElementById('menu_long_break');

    startButton.addEventListener('click', () => {
        if (isRunning) {
            pauseCounter(startButton);
        } else {
            startCounter(startButton, counterDisplay);
        }
    });
    resetButton.addEventListener('click', () =>
        resetTimer(counterDisplay, startButton)
    );
    pomodoroButton.addEventListener('click', () =>
        switchMode('pomodoro', counterDisplay, startButton)
    );
    shortBreakButton.addEventListener('click', () =>
        switchMode('short_break', counterDisplay, startButton)
    );
    longBreakButton.addEventListener('click', () =>
        switchMode('long_break', counterDisplay, startButton)
    );

    updateDisplay(counterDisplay);
}

// Formatuje czas (sekundy) do formatu MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${numberFormatUtil(minutes)}:${numberFormatUtil(remainingSeconds)}`;
}

function updateDisplay(counterDisplay) {
    counterDisplay.textContent = formatTime(timeLeft);
}

function startCounter(startButton, counterDisplay) {
    clearInterval(timer);
    timer = setInterval(() => decrementTime(counterDisplay, startButton), 1000);
    isRunning = true;
    startButton.textContent = 'Pause';
    toggleWaveAnimation(true);
}

function pauseCounter(startButton) {
    clearInterval(timer);
    isRunning = false;
    startButton.textContent = 'Start';
    toggleWaveAnimation(false);
}

function decrementTime(counterDisplay, startButton) {
    if (timeLeft > 0) {
        if (timeLeft <= 6) {
            BEEP.play();
        }
        timeLeft--;
        updateDisplay(counterDisplay);
    } else {
        clearInterval(timer);
        RING.play();
        isRunning = false;
        startButton.textContent = 'Start';
    }
}

function resetTimer(counterDisplay, startButton) {
    clearInterval(timer);
    setTimeByMode(currentMode);
    updateDisplay(counterDisplay);
    isRunning = false;
    startButton.textContent = 'Start';
    toggleWaveAnimation(false);
}

function setTimeByMode(mode) {
    switch (mode) {
        case 'pomodoro':
            timeLeft = POMODORO_TIME;
            break;
        case 'short_break':
            timeLeft = SHORT_BREAK_TIME;
            break;
        case 'long_break':
            timeLeft = LONG_BREAK_TIME;
            break;
    }
}
// Zmienia tryb (pomodoro/przerwa) i resetuje licznik
function switchMode(mode, counterDisplay, startButton) {
    currentMode = mode;
    resetTimer(counterDisplay, startButton);
}

// Włącza lub wyłącza animację fal
function toggleWaveAnimation(activate) {
    WAVES.forEach((wave) => {
        if (activate) {
            wave.classList.add('wave-active');
        } else {
            wave.classList.remove('wave-active');
        }
    });
}

// Formatuje liczbę jako dwucyfrową (np. 3 -> "03")
function numberFormatUtil(number) {
    return String(number).padStart(2, '0');
}
