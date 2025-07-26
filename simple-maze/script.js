(function () {
  const TILE_SIZE = 20;
  const GRID_SIZE = 30; // 30 x 30 grid
  const WALL_PROBABILITY = 0.25; // 25% chance each tile becomes a wall

  const canvas = document.getElementById("mazeCanvas");
  const ctx = canvas.getContext("2d");

  function isDarkMode() {
    return document.body.classList.contains("dark");
  }
  // Grid representation: 0 = empty, 1 = wall
  const grid = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    grid[r] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      grid[r][c] = 0;
    }
  }

  // Player position
  const player = { row: 0, col: 0 };

  function resetGrid() {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        grid[r][c] = 0;
      }
    }
    player.row = 0;
    player.col = 0;
  }

  function generateWalls() {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (r === player.row && c === player.col) {
          grid[r][c] = 0; // Keep player's starting tile empty
          continue;
        }
        grid[r][c] = Math.random() < WALL_PROBABILITY ? 1 : 0;
      }
    }
  }

  function draw() {
    // Fill background for empty tiles
    ctx.fillStyle = isDarkMode() ? "#555" : "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (optional, light gray)
    ctx.strokeStyle = isDarkMode() ? "#666" : "#ddd";
    for (let i = 0; i <= GRID_SIZE; i++) {
      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, i * TILE_SIZE);
      ctx.lineTo(canvas.width, i * TILE_SIZE);
      ctx.stroke();

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(i * TILE_SIZE, 0);
      ctx.lineTo(i * TILE_SIZE, canvas.height);
      ctx.stroke();
    }

    // Draw walls
    ctx.fillStyle = isDarkMode() ? "#fff" : "#000";
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c] === 1) {
          ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }

    // Draw player
    ctx.fillStyle = "blue";
    ctx.fillRect(
      player.col * TILE_SIZE,
      player.row * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    );
  }

  function attemptMove(dr, dc) {
    const newRow = player.row + dr;
    const newCol = player.col + dc;

    // Check bounds
    if (
      newRow < 0 ||
      newRow >= GRID_SIZE ||
      newCol < 0 ||
      newCol >= GRID_SIZE
    ) {
      return; // Out of bounds
    }

    // Check for wall collision
    if (grid[newRow][newCol] === 1) {
      return; // Wall tile, cannot move
    }

    player.row = newRow;
    player.col = newCol;
    draw();
  }

  // Event listeners
  document.getElementById("generateWallsBtn").addEventListener("click", () => {
    generateWalls();
    draw();
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    resetGrid();
    draw();
  });

  // Dark mode toggle
  const toggleModeBtn = document.getElementById("toggleModeBtn");
  toggleModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    toggleModeBtn.textContent = document.body.classList.contains("dark")
      ? "Light Mode"
      : "Dark Mode";
    draw();
  });

  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
      case "w":
      case "W":
        attemptMove(-1, 0);
        break;
      case "ArrowDown":
      case "s":
      case "S":
        attemptMove(1, 0);
        break;
      case "ArrowLeft":
      case "a":
      case "A":
        attemptMove(0, -1);
        break;
      case "ArrowRight":
      case "d":
      case "D":
        attemptMove(0, 1);
        break;
    }
  });

  // Initial render
  resetGrid();
  draw();
})();
