import * as ex from 'excalibur';

export class Enemy extends ex.Actor {
  constructor({initialVelocity}:{initialVelocity: [number,number]}) {
    super();
    this.setWidth(15);
    this.setHeight(15);
    this.x = 200;
    this.y = 200;
    this.color = ex.Color.Red; // new ex.Color(255, 0, 255);

    // we are collision-aware!
    this.collisionType = ex.CollisionType.Passive;

    this.vel.setTo(initialVelocity[0], initialVelocity[1]); // 100,140);
  }

  // draw(ctx: CanvasRenderingContext2D) {
  //   ctx.fillStyle = this.color.toString()
  //   ctx.beginPath()
  //   ctx.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2)
  //   ctx.closePath()
  //   ctx.fill()
  // }
}