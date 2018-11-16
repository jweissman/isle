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
  alex: { [key: string]: ex.Sprite }

  constructor(
    public x: number,
    public y: number,
    protected config: GameConfig,
    protected spriteSheet: ex.SpriteSheet 
  ) {
    super();

    this.setWidth(20);
    this.setHeight(36);
    this.collisionArea.pos.y = 12;

    this.color = new ex.Color(255, 255, 255);

    this.collisionType = ex.CollisionType.Active;
    this.speed = config.playerSpeed; // cells/sec
    //this.facing = 'down';
    this.interacting = false;

    this.alex = {
      'down': spriteSheet.getSprite(0),
      'up': spriteSheet.getSprite(1),
      'left': spriteSheet.getSprite(3),
      'right': spriteSheet.getSprite(2),
    }

    // set facing + init sprite
    this.move('down');
    this.halt();
  }

  wireWorld = (world: World) => { this._world = world; }

  interact() {
    let pos = this.interactionPos();
    // console.log("attempting to interact at", {pos});
    this.interacting = true;
    let item = this._world.entityAt(pos.x, pos.y) ||
      this._world.entityAt(pos.x, pos.y+10) ||
      this._world.entityAt(pos.x, pos.y-10) ||
      this._world.entityAt(pos.x-10, pos.y) ||
      this._world.entityAt(pos.x+10, pos.y);
    if (item) {
      let { name, description } = item.kind;
      // console.log("ENTITY IS", {name, description });
      return description;
    }
    // return '(..)';
  }

  interactionPos(): { x:number, y:number }  {
    let interactionPos = this.getCenter().clone();
    let yOff = this.facing === 'up' ? 10 : 16;
    interactionPos.y += yOff; //this.getHeight();
    interactionPos.x -= 2;
    addScalarToVec(interactionPos, this.facing, 24);
    return interactionPos;
  }

  draw(ctx: CanvasRenderingContext2D, engine) {
    super.draw(ctx, engine);
    if (this.config.debugBoundingBoxes) {
      this.collisionArea.debugDraw(ctx, ex.Color.Chartreuse);
      if (this.interacting) {
        let pos = this.interactionPos(); //getCenter().clone();
        ctx.fillRect(pos.x, pos.y - 10, 4, 4);
        ctx.fillRect(pos.x, pos.y, 4, 4);
        ctx.fillRect(pos.x, pos.y + 10, 4, 4);
        ctx.fillRect(pos.x - 10, pos.y, 4, 4);
        ctx.fillRect(pos.x + 10, pos.y, 4, 4);
      }
    }
  }

  halt = () => {
    this.vel = new ex.Vector(0, 0);
  }

  move = (direction: Direction) => {
    this.facing = direction;
    const step = this.speed * 32;
    this.halt();
    if (direction === 'left')  { this.vel.x = -step; }
    if (direction === 'right') { this.vel.x = step; }
    if (direction === 'up')    { this.vel.y = -step; }
    if (direction === 'down')  { this.vel.y = step; }
    this.currentDrawing = this.alex[direction];
    // this.addDrawing(this.alex[direction]);
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
