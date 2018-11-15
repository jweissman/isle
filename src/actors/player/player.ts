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

    this.setWidth(24);
    this.setHeight(16);
    this.collisionArea.pos.y = 12;
    this.collisionArea.pos.x = -2;

    this.color = new ex.Color(255, 255, 255);

    this.collisionType = ex.CollisionType.Active;
    this.speed = 6; // cells/sec?

    //this.on('precollision', (e: ex.PreCollisionEvent) => {
    //  console.log("PRECOLLIDE", { e });
    //  let dir = dirFromVec(e.intersection);
    //  this.stopMovingDirection(dir);
    // // this.halt);
    //});

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
    //this.collisionArea.debugDraw(ctx, ex.Color.Chartreuse);
    super.draw(ctx, engine);
  }

  halt = () => {
     this.vel = new ex.Vector(0,0);
  }

  move = (direction: Direction) => {
    this.facing = direction;
    const step = this.speed * 32;
    if (direction === 'left')  { this.vel.x = -step; }
    if (direction === 'right') { this.vel.x = step; }
    if (direction === 'up')    { this.vel.y = -step; }
    if (direction === 'down')  { this.vel.y = step; }
    // this.setZIndex(this.y);
  }

  //stopMovingDirection = (direction: Direction) => {
  //  switch(direction) {
  //    case 'left': this.vel.x = 0;
  //    case 'right': this.vel.x = 0;
  //    case 'up': this.vel.y = 0;
  //    case 'down': this.vel.y = 0;
  //  }
  //}
}
