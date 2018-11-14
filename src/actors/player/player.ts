import * as ex from 'excalibur';
import { Game } from '../../game';
import { Direction, oppositeWay, addScalarToVec, dirFromVec } from '../../util';
import { Vector } from 'excalibur';
import { World } from '../../world';

export class Player extends ex.Actor {
  speed: number
  facing: Direction
  _world: World
  // _map: ex.TileMap
  blocked: { [key: string]: boolean }

  constructor(public x: number, public y: number) { //game: Game) {
    super();

    this.setWidth(20);
    this.setHeight(10);
    this.collisionArea.pos.y = 8;
    this.collisionArea.pos.x = -4;

    this.color = new ex.Color(255, 255, 255);

    this.collisionType = ex.CollisionType.Active;
    this.speed = 128; // 4 cells/sec?

    this.on('precollision', this.halt);

    this.facing = 'down';
  }

  wireWorld = (world: World) => { this._world = world; }

  interact() {
    let interactionPos = this.getCenter().clone();
    addScalarToVec(interactionPos, this.facing, 32);
    let entity = this._world.entityAt(interactionPos.x, interactionPos.y);
    console.log("ENTITY IS", { entity });
  }

  draw(ctx, engine) {
    this.collisionArea.debugDraw(ctx, ex.Color.Chartreuse);
    super.draw(ctx, engine);
  }

  halt = () => this.vel = new ex.Vector(0,0);

  move = (direction: Direction) => {
    this.facing = direction;
    const step = this.speed; // * 32;
    if (direction === 'left')  { this.vel.x = -step; }
    if (direction === 'right') { this.vel.x = step; }
    if (direction === 'up')    { this.vel.y = -step; }
    if (direction === 'down')  { this.vel.y = step; }
  }
}
