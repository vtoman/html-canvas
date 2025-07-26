# Canvas Watch Timer

A lightweight HTML Canvas application that shows a live digital clock and a grid of configurable countdown timers. All logic runs client-side—simply open `index.html` in any modern browser.

---

## Features

• **Digital clock** – Current system time in `HH:MM:SS` format, centered near the top of a 600 × 600 canvas.

• **Config-driven timers** – Timer buttons are generated from the `window.TIMER_CONFIG` array in `timerConfig.js`. The default set contains nine common durations:

```
0:10  1:00  5:00
10:00 15:00 20:00
30:00 45:00 60:00
```

• **Responsive grid layout** – Buttons are 160 px wide with a 20 px gap, so three fit neatly in each row.

• **Simple interaction**

1. Click an idle button → timer starts.
2. Click while running → timer pauses.
3. Click again **within 2 s** → timer resets; click after 2 s → timer resumes.
4. At 0 seconds the timer plays **three beeps (1 s apart)**, then auto-resets.

• **Audio alert** – Pure Web Audio API (440 Hz sine wave, 0.3 s per beep). If audio isn’t supported, the app fails gracefully.

• **100 % offline** – No build tools or servers needed.

---

## Usage

1. Clone/download the repository.
2. Open `index.html` in your browser.
3. Interact with the timers as described above.

---

## Customizing Timers

Edit `timerConfig.js`:

```js
window.TIMER_CONFIG = [
  "0:30", // 30 seconds
  "2:00", // 2 minutes
  "25:00", // 25-minute Pomodoro
  // …add as many as you like
];
```

Supported formats:

- `SS` → seconds (e.g. `30`)
- `MM:SS` → minutes & seconds (e.g. `2:30`)
- `HH:MM:SS` → hours, minutes & seconds (e.g. `1:15:00`)

The layout engine automatically places buttons three per row; overflow rows are added as needed.

---

## File Overview

| File             | Purpose                                               |
| ---------------- | ----------------------------------------------------- |
| `index.html`     | Canvas container and script includes                  |
| `app.js`         | Rendering loop, timer logic, input handling and audio |
| `timerConfig.js` | Array of timer labels (strings)                       |
| `readme.md`      | This documentation                                    |

---

## License

This project is released under the MIT License.
