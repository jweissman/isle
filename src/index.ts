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

const sheet = new ex.SpriteSheet(Resources.Spritemap, 8, 8, 31, 31);

const startX = 6, startY = 6;
const player = new Player(startX * 32, startY * 32);


player.addDrawing(sheet.getSprite(7));

game.input.keyboard.on('press', (evt: ex.Input.KeyEvent) => {
  let { key } = evt;
  let direction = keyToDirection(key);
  player.tryMove(direction);
})

game.input.keyboard.on('hold', (evt: ex.Input.KeyEvent) => {
  let { key } = evt;
  let direction : Direction = keyToDirection(key);
  player.tryMove(direction);
})

levelOne.add(player);

levelOne.camera.strategy.lockToActor(player);

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

  _mapRes.data.tilesets.forEach((ts) => {
    if (ts.terrains) {
      ts.terrains.forEach(terrain => {
        terrainMeta[terrain.tile] = terrain.properties.reduce((acc, curr) => {
          let { name, value } = curr;
          return (<any>Object).assign(acc, { [name]: value })
        }, {});
      });

      spriteTerrainById = ts.tiles.reduce((acc, curr) => {
        let { terrain, id } = curr;
        let terrainTile = {
          solid: terrain.some(tile => terrainMeta[tile].solid)
        };
        return (<any>Object).assign(acc, { [id]: terrainTile });
      }, {});
    }

  });


  let tileMap: ex.TileMap = Resources.Map.getTileMap();

  tileMap.data.forEach((cell: ex.Cell) => {
    let tile = spriteTerrainById[cell.sprites[0].spriteId];
    cell = Object.assign(cell, tile);
  });

  levelOne.add(tileMap);
  player.wireMap(tileMap);

  // debugger;

  // levelOne.camera.zoom(1, 1000);
  // tileMap.collides(player)
  

});


