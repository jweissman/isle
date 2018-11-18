import * as ex from 'excalibur';

export class Thing extends ex.Actor {
    constructor(public x: number, public y: number, public zOff: number = 0, protected sprite: ex.Sprite) {
        super(x, y, 32, 32, ex.Color.Chartreuse);
        // this.addDrawing(sprite);
    }
    draw(ctx, engine) {
        super.draw(ctx, engine);
        //this.collisionArea.debugDraw(ctx, ex.Color.LightGray);
        //ctx.fillRect(this.x, this.computeZ(), 5, 5);
    }
    computeZ = () => (this.y + 8 + this.zOff * 24) / 10000;
    constructCollisionArea(collision) {
        if (!collision) {
            this.collisionType = ex.CollisionType.PreventCollision;
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