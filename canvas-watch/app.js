// Canvas Watch Application
// -------------------------
// This script draws the current time on a 600x600 canvas and provides two clickable
// timer areas: one for a 5-minute countdown and another for a 1-minute countdown.
// Clicking an idle timer starts it. Clicking a running timer pauses it.
// Clicking a paused timer (with remaining time less than its initial value) resets it.
// When a timer reaches 0, it stops and plays a short beep.

const canvas = document.getElementById("watch");
const ctx = canvas.getContext("2d");

// ----------------------------
// Theme support
// ----------------------------

const THEMES = [
  {
    name: "Dark",
    body: "#222",
    canvasBg: "#000",
    text: "#ffffff",
    active: "#00ff00",
    stroke: "#555555",
    accent: "#00ff00",
  },
  {
    name: "Brown",
    body: "#3b2e2a",
    canvasBg: "#201914",
    text: "#f5e8d4",
    active: "#ffcc66",
    stroke: "#8b6b47",
    accent: "#ffcc66",
  },
  {
    name: "Blue",
    body: "#1d2733",
    canvasBg: "#0c151d",
    text: "#d7e9ff",
    active: "#4ab3ff",
    stroke: "#345",
    accent: "#4ab3ff",
  },
  {
    name: "Purple",
    body: "#2a1d3b",
    canvasBg: "#170f26",
    text: "#e9d7ff",
    active: "#c65bff",
    stroke: "#55407b",
    accent: "#c65bff",
  },
  {
    name: "Green",
    body: "#1d3323",
    canvasBg: "#0f2014",
    text: "#d7ffd7",
    active: "#66ff66",
    stroke: "#476b47",
    accent: "#66ff66",
  },
  {
    name: "Grey",
    body: "#2e2e2e",
    canvasBg: "#111111",
    text: "#e0e0e0",
    active: "#97d9ff",
    stroke: "#666666",
    accent: "#97d9ff",
  },
  {
    name: "Crimson",
    body: "#2b1113",
    canvasBg: "#16090a",
    text: "#ffd7d7",
    active: "#ff4d4d",
    stroke: "#662222",
    accent: "#ff4d4d",
  },
  {
    name: "Teal",
    body: "#112b2b",
    canvasBg: "#081616",
    text: "#d7ffff",
    active: "#4dffff",
    stroke: "#226666",
    accent: "#4dffff",
  },
  {
    name: "Midnight",
    body: "#101020",
    canvasBg: "#060612",
    text: "#ccd1ff",
    active: "#6b74ff",
    stroke: "#303050",
    accent: "#6b74ff",
  },
  {
    name: "Sunset",
    body: "#2b1a11",
    canvasBg: "#140d08",
    text: "#ffdccc",
    active: "#ff9966",
    stroke: "#66422a",
    accent: "#ff9966",
  },
  {
    name: "Olive",
    body: "#212b1d",
    canvasBg: "#0e140a",
    text: "#e1ffd7",
    active: "#a6ff66",
    stroke: "#445733",
    accent: "#a6ff66",
  },
  {
    name: "Cyber",
    body: "#1a1d28",
    canvasBg: "#0d0f14",
    text: "#d7e8ff",
    active: "#ff00ff",
    stroke: "#555577",
    accent: "#ff00ff",
  },
];

let savedIndex = Number(localStorage.getItem("themeIndex"));
let themeIndex = isNaN(savedIndex) ? 0 : savedIndex;
let currentTheme = THEMES[themeIndex];

function applyTheme() {
  document.body.style.background = currentTheme.body;
  canvas.style.background = currentTheme.canvasBg;
}

applyTheme();
localStorage.setItem("themeIndex", themeIndex);

// Square button to change theme (20×20 px in upper-right corner)
const THEME_BUTTON_RECT = {
  x: canvas.width - 30,
  y: 20,
  width: 20,
  height: 20,
};

// Show seconds flag for clock display (persisted)
let storedShow = localStorage.getItem("showSeconds");
let showSeconds = storedShow === null ? true : storedShow === "true";

// Global sound volume (0.0 – 1.0) (persisted)
let storedVol = Number(localStorage.getItem("soundVolume"));
let soundVolume = isNaN(storedVol) ? 0.5 : Math.max(0, Math.min(1, storedVol));

// UI rectangles for sound controls
const PLAY_BUTTON_RECT = { x: 40, y: 520, width: 200, height: 50 };
const VOLUME_BAR_RECT = { x: 300, y: 530, width: 250, height: 30 };

// Define timer rectangles and state
class CountdownTimer {
  constructor(label, seconds, rect, sound = "internal") {
    this.label = label; // Display label (e.g., "5:00")
    this.initial = seconds; // Initial duration in seconds
    this.remaining = seconds; // Remaining time in seconds
    this.running = false; // Is the timer currently counting down?
    this.lastUpdate = 0; // Timestamp of last update (ms)
    this.pausedAt = 0; // Timestamp when paused (ms)
    this.sound = sound; // "internal" or mp3 path
    this.rect = rect; // { x, y, width, height }
  }

  // Start or resume the countdown
  start() {
    this.running = true;
    this.lastUpdate = performance.now();
  }

  // Pause the countdown
  pause() {
    this.running = false;
    this.pausedAt = performance.now();
  }

  // Reset to the initial duration
  reset() {
    this.running = false;
    this.remaining = this.initial;
  }

  // Update the remaining time based on elapsed real time
  tick(now) {
    if (!this.running) return;
    const delta = (now - this.lastUpdate) / 1000; // seconds elapsed since last tick
    this.lastUpdate = now;
    this.remaining -= delta;
    if (this.remaining <= 0) {
      this.remaining = 0;
      this.running = false;
      playAlert(this.sound); // choose sound based on config
      // Reset back to the initial value after the beeps
      setTimeout(() => this.reset(), 3 * 1000);
    }
  }

  // Render the timer rectangle and its content
  draw(ctx) {
    ctx.save();
    // Draw progress fill (bottom to top)
    const progress = this.remaining / this.initial; // 1.0 -> full, 0 -> empty
    if (progress > 0) {
      ctx.fillStyle = this.running ? currentTheme.active : currentTheme.stroke;
      ctx.globalAlpha = 0.25; // semi-transparent so text remains legible
      const fillHeight = this.rect.height * progress;
      ctx.fillRect(
        this.rect.x,
        this.rect.y + this.rect.height - fillHeight,
        this.rect.width,
        fillHeight
      );
      ctx.globalAlpha = 1;
    }

    // Draw rectangle border
    ctx.strokeStyle = currentTheme.stroke;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

    // Choose text color based on state
    ctx.fillStyle = this.running ? currentTheme.active : currentTheme.text;

    // Prepare text
    const text = this.formatDisplay();

    // Draw text centered in rectangle
    ctx.font = "32px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      text,
      this.rect.x + this.rect.width / 2,
      this.rect.y + this.rect.height / 2
    );
    ctx.restore();
  }

  // Determine what text to show inside the rectangle
  formatDisplay() {
    if (!this.running && this.remaining === this.initial) {
      // Not started yet
      return this.label;
    }
    // Show remaining time mm:ss
    const minutes = Math.floor(this.remaining / 60);
    const seconds = Math.floor(this.remaining % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }

  // Determine if a point (px, py) lies within this timer's rectangle
  contains(px, py) {
    const { x, y, width, height } = this.rect;
    return px >= x && px <= x + width && py >= y && py <= y + height;
  }
}

// ----------------------------
// Dynamic timer layout
// ----------------------------

// Layout constants
const BUTTON_WIDTH = 160;
const BUTTON_HEIGHT = 100;
const LEFT_MARGIN = 40;
const GAP_X = 20; // horizontal gap between buttons
const TOP_MARGIN = 140; // distance from top of canvas to first row
const ROW_HEIGHT = BUTTON_HEIGHT + 20; // vertical gap (button height + 20px)

// Convert "HH:MM:SS" or "MM:SS" to total seconds
function parseTimeStringToSeconds(timeStr) {
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return Number(timeStr) || 0;
}

// Build CountdownTimer objects from global configuration array
function buildTimers() {
  const config = Array.isArray(window.TIMER_CONFIG) ? window.TIMER_CONFIG : [];
  return config.map((item, idx) => {
    // Support both string and object entries
    let label, sound;
    if (typeof item === "string") {
      label = item;
      sound = "internal";
    } else {
      label = item.label;
      sound = item.sound || "internal";
    }

    const totalSeconds = parseTimeStringToSeconds(label);
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = LEFT_MARGIN + col * (BUTTON_WIDTH + GAP_X);
    const y = TOP_MARGIN + row * ROW_HEIGHT;
    return new CountdownTimer(
      label,
      totalSeconds,
      {
        x,
        y,
        width: BUTTON_WIDTH,
        height: BUTTON_HEIGHT,
      },
      sound
    );
  });
}

// Initialize timers from configuration
const timers = buildTimers();

// Event listener for mouse clicks on the canvas
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  // Theme button handling (highest priority)
  if (contains(THEME_BUTTON_RECT, clickX, clickY)) {
    themeIndex = (themeIndex + 1) % THEMES.length;
    currentTheme = THEMES[themeIndex];
    applyTheme();
    localStorage.setItem("themeIndex", themeIndex);
    return;
  }

  // Check if click is on the clock area (top portion of canvas)
  if (clickY >= 20 && clickY <= 120) {
    showSeconds = !showSeconds;
    localStorage.setItem("showSeconds", showSeconds);
    return; // do not process timers for this click
  }

  // Sound controls handling
  if (contains(PLAY_BUTTON_RECT, clickX, clickY)) {
    playAlert("internal");
    return;
  }

  if (contains(VOLUME_BAR_RECT, clickX, clickY)) {
    const relative = (clickX - VOLUME_BAR_RECT.x) / VOLUME_BAR_RECT.width;
    soundVolume = Math.max(0, Math.min(1, relative));
    localStorage.setItem("soundVolume", soundVolume);
    return;
  }

  timers.forEach((timer) => {
    if (timer.contains(clickX, clickY)) {
      // Click inside this timer's area
      if (timer.running) {
        // If running, pause it and record time
        timer.pause();
      } else if (timer.remaining === timer.initial) {
        // If not started yet, start it
        timer.start();
      } else if (!timer.running && timer.remaining < timer.initial) {
        // Determine whether to reset or resume based on time since pause
        const now = performance.now();
        if (now - timer.pausedAt <= 2000) {
          // Clicked within 2 seconds -> reset
          timer.reset();
        } else {
          // Resume
          timer.start();
        }
      }
    }
  });
});

// Main animation loop
function animate(now) {
  // Clear canvas with background color
  ctx.fillStyle = currentTheme.canvasBg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw current time at top center
  drawCurrentTime();

  // Update and draw timers
  timers.forEach((timer) => {
    timer.tick(now);
    timer.draw(ctx);
  });

  // Draw sound controls
  drawSoundControls();

  requestAnimationFrame(animate);
}

// Draw current system time (HH:MM:SS) at the top-middle of the canvas
function drawCurrentTime() {
  const now = new Date();
  let timeStr;
  if (showSeconds) {
    timeStr = now.toLocaleTimeString("en-GB", { hour12: false });
  } else {
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    timeStr = `${hh}:${mm}`;
  }

  ctx.save();
  ctx.fillStyle = currentTheme.active;
  ctx.font = "48px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(timeStr, canvas.width / 2, 40);
  ctx.restore();
}

// Play a short beep (440 Hz sine wave for ~0.3s)
function playBeep() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioCtx();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(soundVolume, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
  } catch (err) {
    console.warn(
      "Web Audio not supported or user gesture required for audio playback.",
      err
    );
  }
}

// Play a sequence of beeps (default 3) separated by a given interval (ms)
function playBeepSequence(count = 3, interval = 1000) {
  for (let i = 0; i < count; i++) {
    setTimeout(playBeep, i * interval);
  }
}

// Play mp3 file sequence (three plays by default)
function playMp3Sequence(src, count = 3, interval = 1000) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const audio = new Audio(src);
      audio.play().catch(() => {});
    }, i * interval);
  }
}

// Decide which alert to play
function playAlert(sound) {
  if (!sound || sound === "internal") {
    // Three internal beeps
    playBeepSequence(3, 1000);
  } else {
    // Play mp3 only once
    const audio = new Audio(sound);
    audio.volume = soundVolume;
    audio.play().catch(() => {});
  }
}
// Kick off the animation loop
requestAnimationFrame(animate);

// Utility to check point in rect
function contains(rect, px, py) {
  return (
    px >= rect.x &&
    px <= rect.x + rect.width &&
    py >= rect.y &&
    py <= rect.y + rect.height
  );
}

// Draw sound controls
function drawSoundControls() {
  ctx.save();

  // Play button
  ctx.strokeStyle = currentTheme.stroke;
  ctx.lineWidth = 2;
  ctx.strokeRect(
    PLAY_BUTTON_RECT.x,
    PLAY_BUTTON_RECT.y,
    PLAY_BUTTON_RECT.width,
    PLAY_BUTTON_RECT.height
  );
  ctx.font = "24px monospace";
  ctx.fillStyle = currentTheme.text;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "Test Sound",
    PLAY_BUTTON_RECT.x + PLAY_BUTTON_RECT.width / 2,
    PLAY_BUTTON_RECT.y + PLAY_BUTTON_RECT.height / 2
  );

  // Volume bar outline
  ctx.strokeRect(
    VOLUME_BAR_RECT.x,
    VOLUME_BAR_RECT.y,
    VOLUME_BAR_RECT.width,
    VOLUME_BAR_RECT.height
  );

  // Filled portion
  ctx.fillStyle = currentTheme.active;
  ctx.fillRect(
    VOLUME_BAR_RECT.x,
    VOLUME_BAR_RECT.y,
    VOLUME_BAR_RECT.width * soundVolume,
    VOLUME_BAR_RECT.height
  );

  // Volume text
  ctx.fillStyle = currentTheme.text;
  ctx.font = "18px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  const percent = Math.round(soundVolume * 100);
  ctx.fillText(`Vol ${percent}%`, VOLUME_BAR_RECT.x, VOLUME_BAR_RECT.y - 2);

  // Draw theme button
  drawThemeButton();

  ctx.restore();
}

function drawThemeButton() {
  ctx.save();
  ctx.fillStyle = currentTheme.accent;
  ctx.fillRect(
    THEME_BUTTON_RECT.x,
    THEME_BUTTON_RECT.y,
    THEME_BUTTON_RECT.width,
    THEME_BUTTON_RECT.height
  );
  ctx.strokeStyle = currentTheme.stroke;
  ctx.lineWidth = 2;
  ctx.strokeRect(
    THEME_BUTTON_RECT.x,
    THEME_BUTTON_RECT.y,
    THEME_BUTTON_RECT.width,
    THEME_BUTTON_RECT.height
  );
  ctx.restore();
}
