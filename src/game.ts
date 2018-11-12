import * as ex from 'excalibur';

export class Game extends ex.Engine {
  constructor(width: number, height: number) {
    super({ width, height, displayMode: ex.DisplayMode.FullScreen });
  }

  public start(loader: ex.Loader) {
    return super.start(loader);
  }
}
