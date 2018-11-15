import * as ex from 'excalibur';
import { Game } from '../../game';
import { Direction, oppositeWay, addScalarToVec, dirFromVec } from '../../util';
import { Vector } from 'excalibur';
import { World } from '../../world';
import { GameConfig } from '../../game_config';

export class Player extends ex.Actor {
  interacting: boolean

  speed: number
  facing: Direction
  _world: World
  blocked: { [key: string]: boolean }

  constructor(
    public x: number,
    public y: number,
    protected config: GameConfig
  ) {
    super();

    this.setWidth(20);
    this.setHeight(36);
    this.collisionArea.pos.y = 12; // = this.anchor; //..y = 16;
    //this.collisionArea.pos.x = 2;



    this.color = new ex.Color(255, 255, 255);

    this.collisionType = ex.CollisionType.Active;
    this.speed = 15; // cells/sec?
    this.facing = 'down';
    this.interacting = false;
  }

  wireWorld = (world: World) => { this._world = world; }

  interact() {
    let pos = this.interactionPos();
    console.log("attempting to interact at", {pos});
    this.interacting = true;
    let item = this._world.entityAt(pos.x, pos.y);
    if (item) {
      let { name, description } = item.kind;
      console.log("ENTITY IS", {name, description });
      return description;
    }
    return '(..)';
  }

  interactionPos(): { x:number, y:number }  {
    let interactionPos = this.getCenter().clone();
    let yOff = this.facing === 'up' ? 10 : 16;
    interactionPos.y += yOff; //this.getHeight();
    addScalarToVec(interactionPos, this.facing, 18);
    return interactionPos;
  }

  draw(ctx: CanvasRenderingContext2D, engine) {
    super.draw(ctx, engine);
    if (this.config.debugBoundingBoxes) {
      this.collisionArea.debugDraw(ctx, ex.Color.Chartreuse);
    }
    if (this.interacting) {
      let pos = this.interactionPos(); //getCenter().clone();
      ctx.fillRect(pos.x, pos.y, 4, 4);
    }
  }

  halt = () => {
     this.vel = new ex.Vector(0,0);
  }

  move = (direction: Direction) => {
    this.facing = direction;
    const step = this.speed * 16;
    this.halt();
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
