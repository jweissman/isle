import * as ex from 'excalibur';
import { clamp } from '../../util';

export class Logo extends ex.Label {
  intensity: number;
  constructor(x: number, y: number, message: string) {
    super(message);
    //this.setWidth(200);
    this.x = x; // (game.drawWidth / 2) - 200;
    this.y = y; // 400;

    this.fontFamily = 'Arial';
    this.fontSize = 256;

    this.color = new ex.Color(255,255,255);
    this.intensity = 150;
    this.strobe();
  }

  strobeClamp = clamp(50, 200);

  strobe = () => {
    this.intensity = this.intensity + Math.ceil(Math.random()*16) - 8;
    this.intensity = this.strobeClamp(this.intensity);
    // console.log("strobe", { intensity: this.intensity });

    this.opacity = this.intensity / 255;
  }
}
