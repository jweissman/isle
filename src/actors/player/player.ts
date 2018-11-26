import * as ex from 'excalibur';
import { Game } from '../../game';
import { Direction, oppositeWay, addScalarToVec, dirFromVec, angleFromDir } from '../../util';
import { Vector, Effects } from 'excalibur';
import { World } from '../../world';
import { GameConfig } from '../../game_config';
import { Item } from '../../models';

export class Player extends ex.Actor {
  interacting: boolean // is querying world?
  usingItem: boolean   // currently using equipped item?
  usingItemTicks: number

  equipped: Item

  speed: number
  facing: Direction
  _world: World
  sprites: { [key: string]: ex.Sprite }
  walkSprites: { [key: string]: ex.Animation }
  equipSprite: ex.Sprite

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
    this.collisionArea.recalc();
    this.speed = config.playerSpeed;
    this.interacting = false;
    this.usingItem = false;

    this.sprites = {
      'down':  spriteSheet.getSprite(0),
      'up':    spriteSheet.getSprite(1),
      'right': spriteSheet.getSprite(2),
      'left':  spriteSheet.getSprite(3),
    }

    let walkFrames = [1,2,3,4,5,6].map(x => x * 4)
    let animRate = 125; // 100; // 50; //25;
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

    // set facing + init sprite
    this.move('down');
    this.halt();
  }

  wireWorld = (world: World) => { this._world = world; }

  interact() {
    let pos = this.interactionPos();
    this.interacting = true;
    let entityAndCell = this._world.entityNear(pos.x, pos.y)

    if (entityAndCell) {
      let { entity, cell } = entityAndCell;
      return this._world.interact(entity, cell);
    }
  }

  equip(it: Item) {
    this.equipped = it;
    this.equipSprite = it.kind.drawing.clone()
    this.equipSprite.scale = new ex.Vector(1.25, 1.25)
    //this.equipSprite.anchor = new ex.Vector(0,1);
  }

  interactUsingEquipped() {
    let pos = this.interactionPos();
    this.interacting = true;
    let entityAndCell = this._world.entityNear(pos.x, pos.y)
    if (entityAndCell) {
      let { entity, cell } = entityAndCell;
      return this._world.useItem(entity, cell, this.equipped)
    }
  }

  interactionPos(): { x:number, y:number }  {
    let interactionPos = this.getCenter().clone();
    let yOff = 20;
    if (this.facing === 'up') { yOff -= 2; }
    if (this.facing === 'down') { yOff -= 4; }
    interactionPos.y += yOff; //this.getHeight();
    interactionPos.x -= 2;
    addScalarToVec(interactionPos, this.facing, 24);
    return interactionPos;
  }

  useEquippedItem() {
    // if (!this.usingItem) {
      this.usingItem = true;
      this.usingItemTicks = 0;
      this.interactUsingEquipped();
    // }
  }

  equipmentPos(): { x: number, y: number } {
    let equipmentPos = this.getCenter().clone();
    if (this.facing === 'left') {
      //equipmentPos.x -= 6;
      equipmentPos.y += 6;
    } else {
      equipmentPos.x -= 4;
      equipmentPos.y += 8;
    }
    return equipmentPos;
  }

  draw(ctx: CanvasRenderingContext2D, engine) {
    if (!(this.facing === 'up')) {
      super.draw(ctx, engine);
    }

    if (this.usingItem && this.equipped && this.equipSprite) {
      let littleDrawing = this.equipSprite;
      let ticks = this.usingItemTicks;
      if (this.facing === 'left') {
        ticks = 6-ticks;
        littleDrawing.flipHorizontal = true;
        littleDrawing.anchor = new ex.Vector(-1, 1);
      } else {
        littleDrawing.flipHorizontal = false;
        littleDrawing.anchor = new ex.Vector(0, 1);
        if (this.facing === 'up') { ticks = ticks-4; }
        if (this.facing === 'down') { ticks = ticks+6; }
        //if (this.facing === 'down') { ticks = ticks-4; }
      }
      littleDrawing.rotation = (ticks / 3) - 1;
      let equipPos = this.equipmentPos();
      littleDrawing.draw(ctx, equipPos.x, equipPos.y); //this.x, this.y); //equipPos.y);
    }

    if ((this.facing === 'up')) {
      super.draw(ctx, engine);
    }

    if (this.config.debugBoundingBoxes) {
      this.collisionArea.debugDraw(ctx, ex.Color.Chartreuse);
      if (this.interacting) {
        let pos = this.interactionPos();
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
    this.currentDrawing = this.sprites[this.facing];
  }

  move = (direction: Direction) => {
    this.facing = direction;
    const step = this.speed * 32;
    this.halt();
    if (direction === 'left')  { this.vel.x = -step; }
    if (direction === 'right') { this.vel.x = step; }
    if (direction === 'up')    { this.vel.y = -step; }
    if (direction === 'down')  { this.vel.y = step; }

    this.currentDrawing = this.walkSprites[this.facing];
    //if (Math.abs(this.vel.x + this.vel.y) < this.speed) {
    //  this.halt();
    //  this.currentDrawing = this.sprites[this.facing];
    //}
  }

  update(engine, delta) {
    //this.currentDrawing = this.walkSprites[this.facing];
    //if (Math.abs(this.vel.x + this.vel.y) < this.speed) {
    //  this.halt();
    //  //this.currentDrawing = this.sprites[this.facing];
    //}
    super.update(engine, delta);
    this.setZIndex(this.computeZ());
    //console.log({z: this.getZIndex()})
    if (this.usingItem) {
      let itemSwingTime = 5;
      this.usingItemTicks += 1;
      if (this.usingItemTicks > itemSwingTime) {
        this.usingItem = false;
      } else {
        // this.interactUsingEquipped();
      }
    }
  }

}
