interface GameConfig {
  debugCells: boolean
  debugBoundingBoxes: boolean
  zoom: number,

  // now derived from char pos on map!!
  // playerStart: { x: number, y: number },

  playerSpeed: number,

  bgMusic: boolean,
}

export { GameConfig };