interface GameConfig {
  debugCells: boolean
  debugBoundingBoxes: boolean
  zoom: number,

  playerStart: { x: number, y: number },
  playerSpeed: number,
}

export { GameConfig };