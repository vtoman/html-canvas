# Bouncing Ball – HTML Canvas Demo

This repository contains a minimal example demonstrating how to use the HTML `<canvas>` element to animate a simple bouncing ball. The project is **framework-free** and runs entirely in the browser—no build tools or servers required.

## Quick start

1. Clone or download this repository.
2. Open the `index.html` file in any modern web browser.
3. Watch the ball bounce around the canvas! Click anywhere on the canvas to reset the ball with a new random velocity.

> **Tip**: You can drag the `index.html` file straight into a browser window if double-clicking does not automatically open it.

## How it works

The animation is driven by JavaScript using the 2-D rendering context of the canvas.

1. A `requestAnimationFrame` loop clears the canvas and redraws the ball every frame.
2. Two velocity components (`dx`, `dy`) are added to the ball’s position (`x`, `y`) on every frame.
3. Collision detection inverts the velocity when the ball touches any of the canvas edges, producing the _bounce_.
4. Clicking the canvas calls `resetBall()` which recenters the ball and assigns random velocities, letting you observe different trajectories.

All of this logic lives directly inside `index.html` for maximum portability.

## File overview

| File         | Purpose                                 |
| ------------ | --------------------------------------- |
| `index.html` | Full demo—markup, styles, and animation |
| `readme.md`  | Documentation (you’re reading it!)      |

## Customising

Feel free to tweak the following constants in `index.html` to explore different behaviours:

- `BALL_RADIUS` – Size of the ball.
- Initial values of `dx`, `dy` – Speed and direction.
- `<canvas>` `width` / `height` – Playfield size.

## License

This demo is released under the MIT License. See the [LICENSE](LICENSE) file for details.
