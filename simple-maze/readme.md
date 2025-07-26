# Simple Maze (HTML Canvas)

This tiny web project draws a 30 × 30 tile grid inside a `<canvas>` and lets you
roam around as a blue square while avoiding randomly-generated walls.

## Features

- **Fixed grid:** 30 rows × 30 columns, each tile 20 px (canvas 600 × 600 px).
- **Player tile:** Blue square that moves one tile at a time with **Arrow keys** or **W / A / S / D**.
- **Wall generation:** Click **Generate Walls** to fill ~25 % of the tiles with black (or white in dark mode) walls.
- **Reset:** Clears all walls and returns the player to the top-left corner.
- **Dark / Light mode:** Toggles page theme; in dark mode the grid lines stay visible and empty tiles become gray.

## Controls

| Button / Key       | Action                          |
| ------------------ | ------------------------------- |
| Generate Walls     | Populate random wall tiles      |
| Reset              | Clear walls and player position |
| Dark / Light Mode  | Toggle UI theme                 |
| Arrow keys or WASD | Move the player one tile        |

## Running the example

1. Clone or download this repository.
2. Open `index.html` in any modern web browser.
3. Explore the maze! Generate new walls, switch themes, and navigate around.

## Customizing

- **Wall density:** Adjust `WALL_PROBABILITY` inside `script.js`.
- **Grid size:** Change `GRID_SIZE` (and optionally `canvas` width/height and `TILE_SIZE`).
- **Colors:** Modify theming styles in `index.html` or drawing colors in `script.js`.

Enjoy experimenting with the canvas maze! :sparkles:
