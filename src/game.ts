import * as ex from 'excalibur';
import { Resources } from './resources';
import { GameConfig } from './game_config';
import { setupMaster } from 'cluster';
import { LevelOne } from './scenes/level-one/level-one';

export class Game extends ex.Engine {
  constructor(width: number, height: number, config: GameConfig) {
    super({ width, height, displayMode: ex.DisplayMode.FullScreen });

    this.setup();
  }


  // entrypoint

  public start() {
    let loader = new ex.Loader();
    for (let key in Resources) {
      loader.addResource(Resources[key]);
    }

    return super.start(loader).then(this.kick);
  }

  // runs on new Game
  protected setup() {
    // console.log("game setup here")
    // initialize island...

    // const levelOne = new LevelOne();
    // this.add(levelOne);
  }

  // runs after loader
  protected kick() {

  } 
}
