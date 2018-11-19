import * as ex from 'excalibur';
import { GameConfig } from '../game_config';

export class Thing extends ex.Actor {
    constructor(
        public x: number,
        public y: number,
        public zOff: number = 0,
        public size: number = 1,
        public debugBoxes: boolean,
    ) {
        super(x, y, 32 * size, 32 * size, ex.Color.Chartreuse);
    }

    draw(ctx, engine) {
        super.draw(ctx, engine);
        if (this.debugBoxes) {
            this.collisionArea.debugDraw(ctx, ex.Color.LightGray);
            ctx.fillRect(this.x, this.computeZ(), 5, 5);
        }
    }

    computeZ = () => (this.y + 4 + (this.size-1) * 16); // / 10000;
    constructCollisionArea(collision) {
        if (!collision) {
            if (this.size > 1) {
                // console.log("CREATE LARGE THING!!!")
                this.collisionType = ex.CollisionType.Fixed;
                this.body.useBoxCollision(
                    new ex.Vector(
                        0, //(32 * this.size) / 2,
                        (16 * this.size) - 14 
                    )
                )
                this.setHeight((26*this.size) / 4);
                this.setWidth(24*this.size);
            } else {
                this.collisionType = ex.CollisionType.PreventCollision;
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
                console.warn("implement collider:", { collision });
                //debugger;
            }
        }
    }
}