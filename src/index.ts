import * as ex from 'excalibur';
import { LevelOne } from './scenes/level-one/level-one';
import { MainMenu } from './scenes/main-menu/main-menu';
import { Player, Enemy, Logo } from './actors';
import { Resources } from './resources';
import { Game } from './game';

import { Isle } from './models';

// const island = new Isle();

const game = new Game(800, 600);

const mainMenu = new MainMenu();
game.add('main-menu', mainMenu);

const levelOne = new LevelOne();



// const logo = new Logo(game, 'Isle');
// levelOne.add(logo);


const sheet = new ex.SpriteSheet(Resources.Spritemap, 8, 8, 32, 32);

const player = new Player(game);

//player.addDrawing(sheet.getSprite(0));


//player.addDrawing(Resources.Sword);
game.input.pointers.primary.on('move', (evt: ex.Input.PointerEvent) => {
  // player.pos.x = evt.worldPos.x;

  const dy = 40;
  if (player.pos.y > evt.worldPos.y) {
    player.vel.y -= dy;
  }
  if (player.pos.y < evt.worldPos.y) {
    player.vel.y += dy;
  }

  player.vel.y = ex.Util.clamp(player.vel.y, -250, 250);
});

levelOne.add(player);

const enemy = new Enemy({initialVelocity: [500,400]});
enemy.addDrawing(sheet.getSprite(1)); //Resources.Sword);
enemy.on('precollision', (ev) => {
  let intersection = ev.intersection.normalize();
  if (Math.abs(intersection.x) > Math.abs(intersection.y)) {
    enemy.vel.x *= -1;
  } else {
    enemy.vel.y *= -1;

    // give a percentage from player?
    enemy.vel.y += player.vel.y * 0.2;
  }

  const boost = 1.00125;
  enemy.vel.x = enemy.vel.x * boost;
  enemy.vel.y = enemy.vel.y * boost;
});

enemy.on('postupdate', () => {
  //console.log("pos", enemy.pos);
  if (enemy.pos) {
    if (enemy.pos.x < enemy.getWidth() / 2) {
      enemy.vel.x *= -1;
    }

    if (enemy.pos.x + enemy.getWidth() / 2 > game.drawWidth) {
      enemy.vel.x *= -1;
    }

    if (enemy.pos.y < enemy.getHeight() / 2) {
      enemy.vel.y *= -1;
    }

    if (enemy.pos.y + enemy.getWidth() / 2 > game.drawHeight) {
      enemy.vel.y *= -1;
    }
  }
})

// enemy.draw = (ctx) => {
//   ctx.fillStyle = this.color.toString();
// }

levelOne.add(enemy);

game.add('wander', levelOne);


// enemy.vel.setTo(200,10);




let loader = new ex.Loader();
for (let key in Resources) {
  loader.addResource(Resources[key]);
}

game.start(loader).then(() => {
  game.goToScene('main-menu');

  Resources.Map.data.tilesets.forEach((ts) => {
    console.log(ts.image, ts.imageTexture.isLoaded());
  });

  let map = Resources.Map.getTileMap();
  console.log("THE MAP", { map });
  levelOne.add(Resources.Map.getTileMap());

  // game.addTimer(
  //   new ex.Timer(logo.strobe, 20, true)
  // );
});


