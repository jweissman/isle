import * as ex from 'excalibur';
import { Game } from '../../game';
import { Direction, oppositeWay, addScalarToVec, dirFromVec } from '../../util';
import { Vector } from 'excalibur';
import { World } from '../../world';
import { GameConfig } from '../../game_config';
import { Item } from '../../models';

export class Player extends ex.Actor {
  interacting: boolean
  equipped: Item

  speed: number
  facing: Direction
  _world: World
  sprites: { [key: string]: ex.Sprite }
  walkSprites: { [key: string]: ex.Animation }

  constructor(
    public name: string,
    public x: number,
    public y: number,
    protected config: GameConfig,
    protected spriteSheet: ex.SpriteSheet,
    private engine: ex.Engine,
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

    let walkFrames = [1,2,3,4,5,6].map(x => x * 4)
    let animRate = 125;
    this.walkSprites = {
      'down': spriteSheet.getAnimationByIndices(
        engine,
        walkFrames, // [4, 8, 12, 16, 20, 24], // 1, 2, 3, 4],
        animRate
      ),
      'up': spriteSheet.getAnimationByIndices(
        engine,
        walkFrames.map(x => x+1),
        animRate
      ),
      'right': spriteSheet.getAnimationByIndices(
        engine,
        walkFrames.map(x => x+2),
        animRate
      ),
      'left': spriteSheet.getAnimationByIndices(
        engine,
        walkFrames.map(x => x+3),
        animRate
      )
    }

    // assemble indexes for walking...
    //let directions = ['down', 'up', 'right', 'left'];
    //directions.forEach((dir: Direction, column: number) => {
    //  //let dirIndices: number[] = [0,1,2,3,4,5].map((index: number) => {
    //  //  return 4 + index*4 + column
    //  //})
    //  this.sprites['walk'][dir] = spriteSheet.getAnimationByIndices(
    //    engine,
    //    [1,2,3,4],
    //    8
    //  )
    //})

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

    if (this.equipped) {
      let littleDrawing = this.equipped.kind.drawing.clone()
      littleDrawing.scale = new ex.Vector(0.5, 0.5)
      littleDrawing.draw(ctx, this.pos.x, this.pos.y)
    }

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
    this.currentDrawing = this.walkSprites[this.facing];
    if (Math.abs(this.vel.x + this.vel.y) < this.speed) {
      this.halt();
      this.currentDrawing = this.sprites[this.facing];
    }
    super.update(engine, delta);
    this.setZIndex(this.computeZ());
    //console.log({z: this.getZIndex()})
  }

}
