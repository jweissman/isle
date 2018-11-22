import * as ex from 'excalibur';
import { World } from '../../world';
import { BasicSpriteMap } from '../../basic_sprites';

export class LevelOne extends ex.Scene {
  world: World

  public onInitialize(engine: ex.Engine) {
  }

  public wireWorld(world: World) { this.world = world; }

  public onActivate() {
    
  }

  public onDeactivate() {

  }

  // public update(engine: ex.Engine, delta) {
  //   super.update(engine, delta);
  // }

  public draw(ctx, delta) {
    super.draw(ctx, delta);

    // draw currently-crafting item...
    if (this.world && this.world.crafting) {
      console.log("TRYING TO DRAW CRAFTING ITEM", this.world.craftingItem);
      let sprite: ex.Sprite = BasicSpriteMap[this.world.craftingItem]; //.clone();
      if (sprite) { //BasicSpriteMap[this.world.craftingItem])
        let craftPreview = sprite.clone()
        let { x, y } = this.world.craftingAt;
        // console.log("draw crafting item at", {x,y});
        craftPreview.opacity(0.5);
        craftPreview.scale = new ex.Vector(2, 2);

        // maybe it's red if we can't do it??

        craftPreview.draw(ctx, x, y);
      }
    }
  }
}
