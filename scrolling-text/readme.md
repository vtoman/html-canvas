# Scrolling Text Canvas Demo

This repository contains a minimal HTML5 Canvas example that animates the text scrolling from right to left across the screen. When the text has fully disappeared on the left, it re-enters from the right edge and the colour changes to the next value in a predefined list. The background remains solid black throughout.

---

## 🖥️ Quick Preview

Simply open the `index.html` file in any modern web browser and the animation will start automatically.

---

## 🚀 Setup Guide

1. **Clone or download** this repository.
   ```bash
   git clone https://github.com/<your-username>/scrolling-text.git
   cd scrolling-text
   ```
2. **Open** the `index.html` file in your favourite browser.
   _No build step, package manager, or server is required – everything runs client-side._

> **Tip:** If you are using VS Code, the **Live Server** extension provides automatic reloads whenever you edit the file.

---

## 🔧 Customisation

All configurable values are located at the top of the inline script in `index.html`.

```js
const text = "Viktor Car"; // The message to scroll
const colors = ["#f44336" /* … */]; // Array of colours to cycle through
const speed = 2; // Pixels moved per animation frame
```

Feel free to adjust the font, speed, colours, or message to suit your needs.

---

## 📄 License

This project is released under the MIT License – see the [LICENSE](LICENSE) file for details.
