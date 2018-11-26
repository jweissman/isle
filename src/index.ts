import * as ex from 'excalibur';
import { LevelOne } from './scenes/level-one/level-one';
import { Resources } from './resources';
import { Game } from './game';
import { keyToDirection, Direction, mode } from './util';
import { World, Material } from './world';
import { GameConfig } from './game_config';
import { Hud } from './actors/hud';
import { BasicSpriteMap } from './basic_sprites';
import { TileMap } from 'excalibur';

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
  zoom: 3,
  playerSpeed: 3.2,
  bgMusic: false
}

// ex.Physics.boundsPadding = config.playerSpeed * 3;
// ex.Physics.collisionPasses = 24;

const game = new Game(800, 600, config);
const levelOne = new LevelOne();

const hud = new Hud(game);
levelOne.add(hud);

const world = new World(levelOne, hud, config, game);
levelOne.wireWorld(world); // hmmm

game.input.keyboard.on('press', (evt: ex.Input.KeyEvent) => {
    // check for current scene?
  if (game.currentScene === levelOne) {
    let player = world.primaryCharacter();

    let { key } = evt;
    if (key === ex.Input.Keys.E) {
      let interaction = player.interact();
      if (interaction) {
        hud.describe(interaction);
      }
    } else if (key === ex.Input.Keys.C) {
      if (!world.crafting) {
        hud.describe('would craft!');
        world.enterCraftMode('BigCampfire', 0,0);
      } else {
        world.crafting = false;
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
      // console.log('about to play music', { theme, isLoaded: theme.isLoaded() });
      theme.play(0.2) //1.0)
    }, 3000);
  }

  //game.input.pointers.primary.on('move', (e: ex.Input.PointerEvent) => {
  //  // console.log("MOUSE MOVE");
  //  let { pos } = e;
  //  if (world && world.crafting) {
  //    // console.log("MOUSE MOVE while CRAFTING...");
  //    let cell = world.tileMap.getCellByPoint(pos.x, pos.y);
  //    let x = cell.x, y = cell.y;
  //    let screenPos = game.worldToScreenCoordinates(new ex.Vector(x,y));
  //    //world.craftingItem = 'campfire';
  //    world.craftingAt = screenPos;
  //    //console.log("draw fire sprite at", {x,y});
  //    //fireSprite.draw(game.ctx, x, y); //cell.x * 32, cell.y * 32);
  //  }
  //});

  game.input.pointers.primary.on('down', (e: ex.Input.PointerEvent) => {
    let { pos } = e;
    // console.log("CLICK", { pos });
    if (world && world.crafting) { // && world.ableToCraft()) {
      // console.log("CLICK while CRAFTING");
      // hud.describe(`would build ${world.craftingItem}!`);
      let kind = world.itemKinds[world.craftingItem];

      let cell = world.tileMap.getCellByPoint(pos.x, pos.y);
      //debugger;
      world.spawn(kind, cell);
      world.crafting = false;
      world.debit(Material.Wood);
      //world.primaryCharacter().a
    } else {
      if (world._primaryCharacter.equipped) {
        world.primaryCharacter().useEquippedItem();
      }
    }
  })

});