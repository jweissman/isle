import * as ex from 'excalibur';
import { LevelOne } from './scenes/level-one/level-one';
import { MainMenu } from './scenes/main-menu/main-menu';
import { Player, Enemy, Logo } from './actors';
import { Resources } from './resources';
import { Game } from './game';

import { Isle } from './models';

import { keyToDirection, Direction, mode } from './util';
import { TileMap } from 'excalibur';

// const island = new Isle();

const game = new Game(800, 600);

const mainMenu = new MainMenu();
game.add('main-menu', mainMenu);

const levelOne = new LevelOne();

const sheet = new ex.SpriteSheet(Resources.Spritemap, 8, 8, 32, 32);

const startX = 4, startY = 4;
const player = new Player(startX * 32, startY * 32);


player.addDrawing(sheet.getSprite(7));

game.input.keyboard.on('press', (evt: ex.Input.KeyEvent) => {
  let { key } = evt;
  let direction = keyToDirection(key);
  if (direction) {
    player.move(direction);
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
  console.log("RELEASE", { evt });
  let { key } = evt;
  let direction : Direction = keyToDirection(key);
  if (direction) {
    player.halt(); //direction);
  }
});

levelOne.add(player);

levelOne.camera.strategy.lockToActor(player);

// game.input.pointers.primary.on('move', (e: ex.Input.PointerEvent) => {
//   console.log("POINTER MOVE", e.pos);
// });


game.add('wander', levelOne);

let loader = new ex.Loader();
for (let key in Resources) {
  loader.addResource(Resources[key]);
}

game.start(loader).then(() => {
  game.goToScene('wander');

  let _mapRes = Resources.Map;
  let terrainMeta = {};
  let spriteTerrainById = {};
  let spriteCollisionById = {};

  _mapRes.data.tilesets.forEach((ts) => {
    console.log("TILESET", { ts });
    if (ts.terrains) {
      ts.terrains.forEach(terrain => {
        if (terrain.properties) {
          terrainMeta[terrain.tile] = terrain.properties.reduce((acc, curr) => {
            let { name, value } = curr;
            return (<any>Object).assign(acc, { [name]: value })
          }, {});

          terrainMeta[terrain.tile].terrainName = terrain.name;

          console.log(
            `terrain ${terrain.name} (${terrain.tile}) has props: `,
            terrainMeta[terrain.tile]
          )
        }
      });

      spriteTerrainById = ts.tiles.reduce((acc, curr) => {
        let { terrain, id } = curr;
        const solid = terrain.some(tile => terrainMeta[tile] && terrainMeta[tile].solid); // : false);
        let terrainTile = { solid };
        console.log(`terrain set for ${id}`, {solid}, terrain.map(tile => terrainMeta[tile]))
        return (<any>Object).assign(acc, { [id]: terrainTile });
      }, {});

      console.log({ terrainMeta, spriteTerrainById });
    }

    // console.log({tiles: ts.tiles})
    if (ts.tiles && ts.tiles.some(tile => tile.objectgroup)) {
      // console.log("todo -- extract obj group collision frame?");
      //debugger;
      spriteCollisionById = ts.tiles.reduce((acc, curr) => {
        let { objectgroup, id } = curr;
        if (objectgroup && objectgroup.objects && objectgroup.objects.length) {
          return (<any>Object).assign(acc, { [id]: objectgroup.objects[0] });
        } else {
          return acc;
        }
      }, {});

      console.log({spriteCollisionById});

    }
  });


  let tileMap: ex.TileMap = Resources.Map.getTileMap();

  tileMap.data.forEach((cell: ex.Cell) => {
    let tile = spriteTerrainById[cell.sprites[0].spriteId];
    // console.log({ cell, tile });
    if (cell.sprites[1]) {
      const collision = spriteCollisionById[cell.sprites[1].spriteId]; 
      // may need to grab object group?
      //cell.
      //debugger;
      let block = new ex.Actor(cell.x + 12, cell.y, 32, 32);
      block.collisionType = ex.CollisionType.Fixed;
      block.body.useCircleCollision(
        collision.height, // / 1.2,
        new ex.Vector(collision.x, collision.y)
        // 16,16) // 0,0) // collision.x, collision.y)
      );
      //block.draw = (ctx) => { //block.body.actor.debugDraw(ctx); }
      //  block.collisionArea.debugDraw(ctx, ex.Color.LightGray);
      //}
      // block.pos.x = cell.x;
      // block.pos.y = cell.y;
      console.log({collision, block});
      // add to level
      levelOne.add(block);
    }
    cell = Object.assign(cell, tile);
  });

  levelOne.addTileMap(tileMap);
  // player.wireMap(tileMap);
  //player.on('collisionstart', console.log);

  // console.log("setup pointers...");

  let lastViewedCell = null;
  game.input.pointers.primary.on('move', (e: ex.Input.PointerEvent) => {
    let { pos } = e;
    let cell = tileMap.getCellByPoint(pos.x, pos.y);
    if (cell && lastViewedCell != cell) {
    //console.log("---> INSPECT CELL AT", { pos });
      // console.debug("CELL", { pos, spriteId: cell.sprites[0].spriteId }, cell);
      lastViewedCell = cell; 
    }
  });

  // console.log("pointers setup!");

  // debugger;

  // levelOne.camera.zoom(1, 1000);
  // tileMap.collides(player)
  

});


