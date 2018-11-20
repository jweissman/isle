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
import { GamepadAxisEvent, UIActor } from 'excalibur';

// Islands are either from before or for after humankind. (gd)

/* 
Dreaming of islands — whether with joy or in fear, it 
doesn't matter — is dreaming of pulling away, of being already separate, far 
from any continent, of being lost and alone — or it is dreaming of starting from 
scratch, recreating, beginning anew. (gd)
*/

// An island doesn't stop being deserted simply because it is inhabited. (gd)

//class Hud extends ex.UIActor {
//  game: Game
//  // build ui elements? respond to events?
//}

// take input commands, route to world/player actions?
// class Gamespace {
//   world: World
//   //hud: Hud

//   handleInteract() {
//     let player = this.getPlayer();
//     player.interact();
//   }

//   move(direction) {

//   }

//   // does this even work???
//   getPlayer = this.world.primaryCharacter
// }

const config: GameConfig = {
  debugCells: false,
  debugBoundingBoxes: false,
  zoom: 3,
  playerSpeed: 7,
  bgMusic: true
}

const game = new Game(800, 600, config);

const levelOne = new LevelOne();
const world = new World(levelOne, config);

const hud = new ex.UIActor(0,0,game.canvasWidth, game.canvasHeight);

const output = new ex.Label(
  '(press E to interact)',
  game.canvasWidth/2,
  game.canvasHeight - 40,
  'Arial'
);
output.color = ex.Color.White;
output.fontSize = 48
output.setWidth(game.canvasWidth);
output.textAlign = ex.TextAlign.Center;

const brand = new ex.Label('I S L E', 10, 50, 'Arial');
brand.color = ex.Color.Azure;
brand.fontSize=24
const inventory = new ex.Label('inventory: empty', game.canvasWidth-300,40, 'Arial')
inventory.color = ex.Color.Green;
inventory.fontSize=24
hud.add(output);
hud.add(brand);
//hud.add(inventory);
levelOne.add(hud);


//game.gamepads.on('connect', (ce: ex.Input.GamepadConnectEvent) => {
//  //var newPlayer = CreateNewPlayer(); // pseudo-code for new player logic on gamepad connection
//  console.log('Gamepad connected', ce);
//  ce.gamepad.on('button', (be: ex.GamepadButtonEvent) => {
//    if (be.button === ex.Input.Buttons.Face1) {
//      newPlayer.jump();
//    }
//  });
//
//  ce.gamepad.on('axis', (ae: ex.GamepadAxisEvent) => {
//    if (ae.axis === ex.Input.Axis.LeftStickX && ae.value > 0.5) {
//      newPlayer.moveRight();
//    }
//  });
//});
 

game.input.keyboard.on('press', (evt: ex.Input.KeyEvent) => {
  let player = world.primaryCharacter();

  // check for current scene?
  let { key } = evt;
  if (key == ex.Input.Keys.E) {
    let interaction = player.interact();
    if (interaction) {
      output.text = interaction;
      output.opacity = 1;
      output.actions.clearActions();
      output.actions.fade(0, 2000);
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




game.add('wander', levelOne);


game.start().then(() => {
  world.processTiledMap(Resources.Map);

  let tileMap = world.tileMap;
  levelOne.addTileMap(tileMap);

  //output.setZIndex(1000);

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


