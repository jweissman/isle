import * as ex from 'excalibur';
import { LevelOne } from './scenes/level-one/level-one';
import { Resources } from './resources';
import { Game } from './game';
import { keyToDirection, Direction, mode } from './util';
import { World } from './world';
import { GameConfig } from './game_config';
import { Hud } from './actors/hud';

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
  playerSpeed: 7,
  bgMusic: true
}

const game = new Game(800, 600, config);
const levelOne = new LevelOne();

const hud = new Hud(game);
levelOne.add(hud);

const world = new World(levelOne, hud, config);

game.input.keyboard.on('press', (evt: ex.Input.KeyEvent) => {
    // check for current scene?
  if (game.currentScene === levelOne) {
    let player = world.primaryCharacter();

    let { key } = evt;
    if (key == ex.Input.Keys.E) {
      let interaction = player.interact();
      if (interaction) {
        hud.describe(interaction);
      }
    } else {
      // assume we're trying to move
      let direction = keyToDirection(key);
      if (direction) { player.move(direction); }
    }
  }
})

game.input.keyboard.on('hold', (evt: ex.Input.KeyEvent) => {
  let { key } = evt;
  let direction: Direction = keyToDirection(key);
  if (direction) {
    let player = world.primaryCharacter();
    player.move(direction);
  }
})

game.input.keyboard.on('release', (evt: ex.Input.KeyEvent) => {
  // console.log("RELEASE", { evt });
  let { key } = evt;
  let direction: Direction = keyToDirection(key);
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
  game.goToScene('wander');

  // really should be an audio player!
  if (config.bgMusic) {
    let theme = Resources.FineMist; //Science;
    // wait a tiny bit for music to load??? (seems to work welll)
    setTimeout(() => {
      console.log('about to play music', { theme, isLoaded: theme.isLoaded() });
      theme.play(0.2) //1.0)
    }, 3000);
  }
});