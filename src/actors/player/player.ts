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
  sprites: { [key: string]: ex.Sprite }

  constructor(
    public name: string,
    public x: number,
    public y: number,
    protected config: GameConfig,
    protected spriteSheet: ex.SpriteSheet 
  ) {
    super(x, y, 32, 64);

    this.collisionArea.body.useCircleCollision(6, new ex.Vector(0, 22));
    this.color = new ex.Color(255, 255, 255);

    this.collisionType = ex.CollisionType.Active;
    this.speed = config.playerSpeed;
    this.interacting = false;

    this.sprites = {
      'down':  spriteSheet.getSprite(0),
      'up':    spriteSheet.getSprite(1),
      'right': spriteSheet.getSprite(2),
      'left':  spriteSheet.getSprite(3),
    }


    // set facing + init sprite
    this.move('down');
    this.halt();
  }

  wireWorld = (world: World) => { this._world = world; }

  interact() {
    let pos = this.interactionPos();
    this.interacting = true;
    let entityAndCell = this._world.entityAt(pos.x, pos.y) ||
      this._world.entityAt(pos.x, pos.y+10) ||
      this._world.entityAt(pos.x, pos.y-10) ||
      this._world.entityAt(pos.x-10, pos.y) ||
      this._world.entityAt(pos.x+10, pos.y);
    if (entityAndCell) {
      let { entity, cell } = entityAndCell;
      return this._world.interact(entity, cell);
    }
  }

  interactionPos(): { x:number, y:number }  {
    let interactionPos = this.getCenter().clone();
    let yOff = 20; //this.facing === 'up' ? 10 : 16;
    if (this.facing === 'up') { yOff -= 2; }
    if (this.facing === 'down') { yOff -= 4; }
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
      ctx.fillRect(this.x, this.computeZ(), 3, 3);
    }
  }

  computeZ = () => (this.y + 24); // / 10000; //8;

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
  }

  update(engine, delta) {
    this.currentDrawing = this.sprites[this.facing];
    super.update(engine, delta);
    this.setZIndex(this.computeZ());
    //console.log({z: this.getZIndex()})
  }

}
