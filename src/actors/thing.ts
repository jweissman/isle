import * as ex from 'excalibur';
import { GameConfig } from '../game_config';

export class Thing extends ex.Actor {
    constructor(
        public x: number,
        public y: number,
        // public zOff: number = 0,
        public width: number = 1,
        public height: number = 1,
        public layer: number = 0,
        public debugBoxes: boolean,
    ) {
        super(x, y, 32 * width, 32 * height, ex.Color.Chartreuse);
    }

    draw(ctx, engine) {
        super.draw(ctx, engine);
        if (this.debugBoxes) {
            this.collisionArea.debugDraw(ctx, ex.Color.LightGray);
            ctx.fillRect(this.x, this.computeZ(), 5, 5);
        }
    }

    computeZ = () => (this.y + 4 + (this.height-1) * 16) + this.layer; // / 10000;
    constructCollisionArea(collision) {
        if (!collision) {
            if (this.width > 1 || this.height > 1) {
                // console.log("CREATE LARGE THING!!!")
                this.collisionType = ex.CollisionType.Fixed;
                this.body.useBoxCollision(
                    new ex.Vector(
                        0, //(32 * this.size) / 2,
                        (16 * this.height) - 14 
                    )
                )
                this.setHeight((26*this.height) / 4);
                this.setWidth(30*this.width);
            } else {
                // this.collisionType = ex.CollisionType.PreventCollision;
                this.collisionType = ex.CollisionType.Fixed;
            }
        }
        else {
            this.collisionType = ex.CollisionType.Fixed;
            if (collision.ellipse) {
                let center = new ex.Vector((collision.x + collision.width / 2) - 16, (collision.y + collision.height / 2) - 16);
                this.body.useCircleCollision(collision.height / 2, center);
            }
            else if (collision.polygon) {
                //console.log("poly", { polygon: collision.polygon });
                //debugger;
                let vecs: ex.Vector[] = collision.polygon.map(({ x, y }) => new ex.Vector(x + collision.x, y + collision.y));
                this.body.usePolygonCollision(vecs);
            }
            else {
                // console.warn("implement collider:", { collision });
                //debugger;
            }
        }
    }
}