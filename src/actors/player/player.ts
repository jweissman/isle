import * as ex from 'excalibur';
import { Game } from '../../game';
import { Direction, oppositeWay, addScalarToVec } from '../../util';

export class Player extends ex.Actor {
  speed: number
  _map: ex.TileMap

  constructor(public x: number, public y: number) { //game: Game) {
    super();
    this.setWidth(50);
    this.setHeight(250);
    this.color = new ex.Color(255, 255, 255);

    // this.collisionType = ex.CollisionType.Fixed;
    this.speed = 4;
  }

  wireMap = (_map : ex.TileMap) => { this._map = _map; }

  tryMove = (direction: Direction) => {
    const blocked: boolean = this.isBlocked(direction);
    if (!blocked) { // this.isBlocked(direction)) {
      this.move(direction);
    }
  }

  move = (direction: Direction) => {
    const step = this.speed;
    addScalarToVec(this.pos, direction, step);
  }

  isBlocked = (direction: Direction) => {
    let newPos = this.pos.clone();
    addScalarToVec(newPos, direction, this.speed);
    let nextCell = this._map.getCellByPoint(newPos.x, newPos.y);
    if (nextCell) {
      return nextCell.solid;
    } else {
      // we are almost off the map?
      return true;
    }
  }
}
