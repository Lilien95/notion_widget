document.addEventListener('DOMContentLoaded', initialize);

let POMODORO_TIME;
let SHORT_BREAK_TIME;
let LONG_BREAK_TIME;
const RING = new Audio('https://rollrollgo.github.io/notion_html_widgets/assets/ring.mp3');
const BEEP = new Audio('https://rollrollgo.github.io/notion_html_widgets/assets/beep.mp3');

let currentMode = 'pomodoro';
let timer;
let timeLeft;
let isRunning = false;

function initialize() {
    const counterDisplay = document.getElementById('counter');
    const startButton = document.getElementById('control_start');
    const pauseButton = document.getElementById('control_pause');
    const resetButton = document.getElementById('control_reset');
    const settingsButton = document.getElementById('control_settings');
    const pomodoroButton = document.getElementById('menu_pomodoro');
    const shortBreakButton = document.getElementById('menu_short_break');
    const longBreakButton = document.getElementById('menu_long_break');
    const pomodoroInput = document.getElementById('pomodoroTime');
    const shortBreakInput = document.getElementById('shortBreakTime');
    const longBreakInput = document.getElementById('longBreakTime');
    const applySettingsButton = document.getElementById('applySettings');
    const cancelSettingsButton = document.getElementById('cancelSettings');
    const settingsOverlay = document.querySelector('.settings-overlay');

    // Ustaw domyślne wartości czasu
    POMODORO_TIME = parseInt(pomodoroInput.value) * 60;
    SHORT_BREAK_TIME = parseInt(shortBreakInput.value) * 60;
    LONG_BREAK_TIME = parseInt(longBreakInput.value) * 60;
    setTimeByMode(currentMode);
    updateDisplay(counterDisplay);
    pauseButton.style.display = 'none';

    settingsButton.addEventListener('click', () => {
        settingsOverlay.style.display = 'flex'; // Pokaż overlay
    });

    applySettingsButton.addEventListener('click', () => {
        POMODORO_TIME = parseInt(pomodoroInput.value) * 60;
        SHORT_BREAK_TIME = parseInt(shortBreakInput.value) * 60;
        LONG_BREAK_TIME = parseInt(longBreakInput.value) * 60;
        setTimeByMode(currentMode);
        updateDisplay(counterDisplay);
        resetTimer(counterDisplay, startButton, pauseButton);
        settingsOverlay.style.display = 'none'; // Ukryj overlay
    });

    cancelSettingsButton.addEventListener('click', () => {
        settingsOverlay.style.display = 'none'; // Ukryj overlay
    });

    startButton.addEventListener('click', () => {
        startCounter(counterDisplay, startButton, pauseButton);
    });

    pauseButton.addEventListener('click', () => {
        pauseCounter(startButton, pauseButton);
    });

    resetButton.addEventListener('click', () =>
        resetTimer(counterDisplay, startButton, pauseButton)
    );

    pomodoroButton.addEventListener('click', () =>
        switchMode('pomodoro', counterDisplay, startButton, pauseButton)
    );

    shortBreakButton.addEventListener('click', () =>
        switchMode('short_break', counterDisplay, startButton, pauseButton)
    );

    longBreakButton.addEventListener('click', () =>
        switchMode('long_break', counterDisplay, startButton, pauseButton)
    );
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${numberFormatUtil(minutes)}:${numberFormatUtil(remainingSeconds)}`;
}

function updateDisplay(counterDisplay) {
    counterDisplay.textContent = formatTime(timeLeft);
}

function startCounter(counterDisplay, startButton, pauseButton) {
    if (!isRunning) {
        clearInterval(timer);
        timer = setInterval(() => decrementTime(counterDisplay, startButton, pauseButton), 1000);
        isRunning = true;
        startButton.style.display = 'none';
        pauseButton.style.display = 'inline-block';
    }
}

function pauseCounter(startButton, pauseButton) {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startButton.style.display = 'inline-block';
        pauseButton.style.display = 'none';
    }
}

function decrementTime(counterDisplay, startButton, pauseButton) {
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
        startButton.style.display = 'inline-block';
        pauseButton.style.display = 'none';
    }
}

function resetTimer(counterDisplay, startButton, pauseButton) {
    clearInterval(timer);
    setTimeByMode(currentMode);
    updateDisplay(counterDisplay);
    isRunning = false;
    startButton.style.display = 'inline-block';
    pauseButton.style.display = 'none';
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

function switchMode(mode, counterDisplay, startButton, pauseButton) {
    currentMode = mode;
    setTimeByMode(mode); // Ustaw nowy czas przed resetowaniem wyświetlacza
    updateDisplay(counterDisplay);
    resetTimer(counterDisplay, startButton, pauseButton);
}

function numberFormatUtil(number) {
    return String(number).padStart(2, '0');
}
