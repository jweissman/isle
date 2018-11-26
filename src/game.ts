import * as ex from 'excalibur';
import { Resources } from './resources';
import { GameConfig } from './game_config';
import { setupMaster } from 'cluster';
import { LevelOne } from './scenes/level-one/level-one';
import { Logo } from './actors';

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

    //loader.backgroundColor = '#8abec0'
    loader.logo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAACACAQAAABOvH+BAAAFUklEQVR4nO2dS5bjIAxFcZ/aR0be/4IYeSXpAXHZ8VfCEjyodyfpU53jyOghxD8EQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEENI8Q20D0Hi90+cEWzKv9zQsdibyrYV9zRq83iHEz79HOAnMLo9hDIudiTGEkCcDsJesyeu9LVQUCSTXx7uvhTHoRQDyis+wCNtb94dQWwJLkL93/YJWBD+KZ3/4bn1syC/or7D9a5n2eUfur0Oe2xdiCGF8y99fXVC5hl0zfj51jju3RlcPzt1fKgY8dfsWud2qCOBXT5Y6LDX8WoqpHoSAnM2HsE7sbIniklQIoESYlBkui0PpG5pw6MV5o1m/4cnIAWqjE2L8zQxyhCCvSefg5BdHNCaAnBxE37zY4ZUz2dGUAJ7VpRQLSosA2/0h/KttgJznoTSGEF5vTTcWZzDIi2YEYNOSxo8IDB7VCWACOKtxlokUelC2QB65wARwjHUeHYvFgGkY779UFUUSOA2ja057NnpXrxvVfwag7AVMw3q8/RiJs45rRf+FXQqNcNXdwLtHjxfj6tJnrMEeRkFEF7eMxwHO29YS4XQfWf6WeHKWhRgLYBqOJZDrfmn9P3v146wFqW23TBJz3qrISKBvgV9N/S5ZS1x9H8n9tW2BHgqW1P/7Ikz/n79YxI/67ocWgI37Z/RFjeAef5oYCDrjb7jIl6YFQJ4DKwD2/8sAKwBShqYFUG5SxwcE+5sWAEYRtk3jAqAEngIrAPlMelQu80KivnzNJ4Nq5O7a7VBIxJsJdu+3Ah4J1FFnza8F11XGW9iwTYCe2HRjcIZ3IwEsgJz1dLMIepKBrwS6aQIW5j2BbTYIpelQAIlW9gdLsNiheAZwE/B8UXX8NAlG5nQJtABs1tX3mBraAS6AJIGnImAcOAdeACFMg1UcMDCmOxoQQAhzHHiaEVACe0x7AZ4DwdulnTlr/j2z6VZprBu4dt92ubeENiXgufaxMQGsWccELh/LpWEBJGYZ9CsB37XPzQsgId+6jtQIyJJaX2uLCKBEoadNYC3FAYxdDY10A2XYnsfh223EcH9nAmjhSBY0OhOARAIcEFrTnQAYBXQUEkDZWkcJyOkwAoRACcjpVAD4oGQiFMAFKE7ypFsBsBGQYSiA68ngv1CbdGCUSLcRoAUQJEABVKX+gtVOZgPbZd6/UGtmgAIAoKYIzJqA+/WAZVu81g6ZqrW11SACSK82Lklr7k/U2M6mvDn06K94RX3tfs1MfPn1Q8vW1gTQAREWt3aVKE7b2l9nCdnqaGuDm9GvKJwEas/x0F8Mbx/8Y9Vdxuub0T0sEAvAqmCXdu6b69uCZC7wuqfzOyzXE8LddT05tlXpBh45aR9o15K7vwha6vz8tXjfYtzjLwzB6enq5kooAP+setvWHv1iPEyOSvdCTu9EAjiTRJ+xNDYQtE+OdK73XItbe0xvtkInASABrE2XDCshsj+xcBpK71bQSQB0MshnNr/MWvztiCf2ygRQAXhQbysGsgSEAkB+BRkl3b+f9bA46MYHoBzgG9u2s3Tt37fD62t3kfIXWAFYSuDO/aUStdkKJCEACWDvJhvHSGq/983o219LnwhCEAugfHfGBmnwv74Z3efNt0KQYzXbCRQBjs1+JrurS2WPOP+ub13NuNTyQjKdjQTmBmet8++s+DxVOP7onXTaPV31IL9R97sCk8/zzZ0t76z/dSEFlMMfJGQY+jILh0vPWFJg9/KzrfVS9uuk2nF/lgBmni9gzCmoq19tqeAJIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEAP+AwVxGTrL66gaAAAAAElFTkSuQmCC";
    loader.logoWidth = 256;
    loader.playButtonText = "Let's go!"
    // null; // Resources.Brand;

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
