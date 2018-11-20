import * as ex from 'excalibur';
import { LevelOne } from './scenes/level-one/level-one';
import { MainMenu } from './scenes/main-menu/main-menu';
import { Player } from './actors';
import { Resources } from './resources';
import { Game } from './game';

import { keyToDirection, Direction, mode } from './util';
import { World } from './world';
import { Thing } from "./actors/thing";
import { GameConfig } from './game_config';

// Islands are either from before or for after humankind. (gd)

/* 
Dreaming of islands — whether with joy or in fear, it 
doesn't matter — is dreaming of pulling away, of being already separate, far 
from any continent, of being lost and alone — or it is dreaming of starting from 
scratch, recreating, beginning anew. (gd)
*/

// An island doesn't stop being deserted simply because it is inhabited. (gd)

const config: GameConfig = {
  debugCells: false,
  debugBoundingBoxes: false,
  zoom: 2,
  playerStart: { x: 24, y: 20 },
  playerSpeed: 7.5,
  bgMusic: true
}


const game = new Game(800, 600, config);

const levelOne = new LevelOne();
const world = new World(levelOne, config);

//const alexSprites = new ex.SpriteSheet(Resources.Alex, 4, 1, 32, 64);
//
//const startX = config.playerStart.x, startY = config.playerStart.y;
//const player = new Player(startX * 32, startY * 32, config, alexSprites);

//player.addDrawing(alexSprite);

const output = new ex.Label('(welcome to isle)', 500, 500, 'Arial');
//output.
const brand = new ex.Label('(welcome to isle)', 500, 500, 'Arial');
levelOne.add(output);
levelOne.add(brand);

game.input.keyboard.on('press', (evt: ex.Input.KeyEvent) => {
  let player = world.primaryCharacter();

  // check for current scene?
  let { key } = evt;
  if (key == ex.Input.Keys.E) {
    let interaction = player.interact();
    if (interaction) {
      output.x = levelOne.camera.x;
      output.y = levelOne.camera.y;
      output.text = interaction;
      output.color = ex.Color.White;
      output.fontSize = 24;
    }
  } else {
    // assume we're trying to move
    let direction = keyToDirection(key);
    if (direction) { player.move(direction); }
  }
})

game.input.keyboard.on('hold', (evt: ex.Input.KeyEvent) => {
  let { key } = evt;
  let direction : Direction = keyToDirection(key);
  if (direction) {
    let player = world.primaryCharacter();
    player.move(direction);
  }
})

game.input.keyboard.on('release', (evt: ex.Input.KeyEvent) => {
  // console.log("RELEASE", { evt });
  let { key } = evt;
  let direction : Direction = keyToDirection(key);
  if (direction) {
    let player = world.primaryCharacter();
    player.halt(); //direction);
    player.interacting = false;
  }
});

//levelOne.add(player);


// game.input.pointers.primary.on('move', (e: ex.Input.PointerEvent) => {
//   console.log("POINTER MOVE", e.pos);
// });


game.add('wander', levelOne);


game.start().then(() => {
  world.processTiledMap(Resources.Map);

  let tileMap = world.tileMap;
  levelOne.addTileMap(tileMap);
  //player.wireWorld(world); //wireMap(tileMap);

  //world.blockingActors.forEach((actor: Thing) => {
  //  //let y = actor['_cell'].y; // - 7;
  //  //console.log("would set z to", {y, currentZeD: actor.getZIndex()});
  //  levelOne.add(actor);
  //  actor.setZIndex(actor.computeZ());
  //});
  output.setZIndex(1000);

  if (config.debugCells) {
    let lastViewedCell = null;
    game.input.pointers.primary.on('move', (e: ex.Input.PointerEvent) => {
      let { pos } = e;
      let cell = tileMap.getCellByPoint(pos.x, pos.y);
      if (cell && lastViewedCell != cell) {
        console.debug("CELL", { pos, spriteId: cell.sprites[0].spriteId }, cell);
        lastViewedCell = cell;
      }
    });
  }

  game.goToScene('wander');

  //theme.play();
  //theme.load().then(() => {

  //  theme.play()
  //}); //() => theme.play();
  //if (theme.isLoaded) {
  //  console.log("playing song...");
  //  //debugger;
  //  //theme.play(1.0);
  //} else {
  //  console.error("theme song not loaded?")
  //  //throw new Error("theme song wasn't loaded?")
  //}

  // really should be an audio player
  if (config.bgMusic) {
    let theme = Resources.FineMist; //Science;
    // wait a tiny bit for music to load??? (seems to work welll)
    setTimeout(() => {
      console.log('about to play music', { theme, isLoaded: theme.isLoaded() });
      theme.play(0.2) //1.0)
    }, 3000);
  }


});


