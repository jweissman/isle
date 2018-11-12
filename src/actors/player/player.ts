import * as ex from 'excalibur';
import { Game } from '../../game';

export class Player extends ex.Actor {
  game: Game;

  constructor(game: Game) {
    super();
    this.setWidth(50);
    this.setHeight(250);
    this.x = game.drawWidth - 80;
    this.y = 100;
    this.color = new ex.Color(255, 255, 255);

    // we are collision-aware!
    this.collisionType = ex.CollisionType.Fixed;

    // hmmm
    this.game = game;
  }
}
