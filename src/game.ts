import * as ex from 'excalibur';
import { Resources } from './resources';

export class Game extends ex.Engine {
  constructor(width: number, height: number) {
    super({ width, height, displayMode: ex.DisplayMode.FullScreen });
  }

  public start() { // loader: ex.Loader) {

    let loader = new ex.Loader();
    for (let key in Resources) {
      loader.addResource(Resources[key]);
    }
    return super.start(loader);
  }
}
