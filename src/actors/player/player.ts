import * as ex from 'excalibur';
import { Game } from '../../game';
import { Direction, oppositeWay, addScalarToVec, dirFromVec } from '../../util';
import { Vector } from 'excalibur';

export class Player extends ex.Actor {
  speed: number
  // _map: ex.TileMap
  blocked: { [key: string]: boolean }

  constructor(public x: number, public y: number) { //game: Game) {
    super();
    this.setWidth(20);
    this.setHeight(10);
    this.collisionArea.pos.y = 8;
    this.collisionArea.pos.x = -4;
    //this.collisionArea.pos.y = 20;
    this.color = new ex.Color(255, 255, 255);

    this.collisionType = ex.CollisionType.Active; //.Fixed;
    //this.body.useBoxCollision(new ex.Vector(0,10));
    this.speed = 200;
    //this.friction = 0.2;

    this.on('precollision', (e) => {
      this.halt();
      //let dir = dirFromVec(e.intersection);
      //console.log("COLLISION FROM", { dir });
      //this.shift(dir, 1);
    });
  }

  //draw(ctx, engine) {
  //  this.collisionArea.debugDraw(ctx, ex.Color.Chartreuse);
  //  super.draw(ctx, engine);
  //}

  halt = () => this.vel = new ex.Vector(0,0);

  //wireMap = (_map : ex.TileMap) => { this._map = _map; }

  //tryMove = (direction: Direction) => {
  //  this.move(direction);
  //}

  move = (direction: Direction) => {
    const step = this.speed;
    if (direction === 'left')  { this.vel.x = -step; }
    if (direction === 'right') { this.vel.x = step; }
    if (direction === 'up')    { this.vel.y = -step; }
    if (direction === 'down')  { this.vel.y = step; }
  }

  //shift = (direction: Direction, step) => {
  //  if (direction === 'left')  { this.pos.x += -step; }
  //  if (direction === 'right') { this.pos.x += step; }
  //  if (direction === 'up')    { this.pos.y += -step; }
  //  if (direction === 'down')  { this.pos.y += step; }
  //}

}
