import * as ex from 'excalibur';
import { LevelOne } from './scenes/level-one/level-one';
import { MainMenu } from './scenes/main-menu/main-menu';
import { Player, Enemy, Logo } from './actors';
import { Resources } from './resources';
import { Game } from './game';

import { Isle } from './models';

import { keyToDirection, Direction, mode } from './util';
import { TileMap } from 'excalibur';
import { World } from './world';
import { GameConfig } from './game_config';

const config: GameConfig = {
  debugCells: false,
  debugBoundingBoxes: false,
  zoom: 4,
  playerStart: { x: 30, y: 30 },
  playerSpeed: 6,
}

ex.Physics.collisionPasses = 8;

// Islands are either from before or for after humankind. (gd)

/* 
Dreaming of islands — whether with joy or in fear, it 
doesn't matter — is dreaming of pulling away, of being already separate, far 
from any continent, of being lost and alone — or it is dreaming of starting from 
scratch, recreating, beginning anew. (gd)
*/

// An island doesn't stop being deserted simply because it is inhabited. (gd)

// const island = new Isle();

const game = new Game(800, 600);

const mainMenu = new MainMenu();
game.add('main-menu', mainMenu);

const levelOne = new LevelOne();

const spritemap = new ex.SpriteSheet(Resources.Spritemap, 8, 8, 32, 32);
const basicSprites = new ex.SpriteSheet(Resources.BasicSprites, 8, 8, 32, 32);
const alexSprites = new ex.SpriteSheet(Resources.Alex, 4, 1, 32, 64);

const tinyAlexSprite = basicSprites.getSprite(4); //spritemap.getSprite(7));
//const alexSprite = alexSprites.getSprite(0); //Resources.Alex.asSprite(); //new ex.Sprite(Resources.Alex.);

const startX = config.playerStart.x, startY = config.playerStart.y;
const player = new Player(startX * 32, startY * 32, config, alexSprites);

//player.addDrawing(alexSprite);

const output = new ex.Label('(welcome to isle)', 500, 500, 'Arial');
//output.
const brand = new ex.Label('(welcome to isle)', 500, 500, 'Arial');
levelOne.add(output);
levelOne.add(brand);

game.input.keyboard.on('press', (evt: ex.Input.KeyEvent) => {
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
    player.move(direction);
  }
})

game.input.keyboard.on('release', (evt: ex.Input.KeyEvent) => {
  // console.log("RELEASE", { evt });
  let { key } = evt;
  let direction : Direction = keyToDirection(key);
  if (direction) {
    player.halt(); //direction);
    player.interacting = false;
  }
});

levelOne.add(player);

levelOne.camera.strategy.lockToActor(player);
levelOne.camera.zoom(config.zoom);

// game.input.pointers.primary.on('move', (e: ex.Input.PointerEvent) => {
//   console.log("POINTER MOVE", e.pos);
// });


game.add('wander', levelOne);


game.start().then(() => {
  game.goToScene('wander');
  let world = new World(Resources.Map, config.debugBoundingBoxes);

  let tileMap = world.tileMap;
  levelOne.addTileMap(tileMap);
  player.wireWorld(world); //wireMap(tileMap);

  world.blockingActors.forEach(actor => levelOne.add(actor));

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

});


