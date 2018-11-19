import * as ex from 'excalibur';
import TiledResource from '@excaliburjs/excalibur-tiled';

const sword = require('./images/sword.png');
const spritemap = require('./images/spritemap.png')
const basicSprites = require('./images/basic-sprites.png')
const alex = require('./images/alex.png')
const greatPalm = require('./images/greatpalm.png')
const palm = require('./images/palm.png')

const fineMist = require('./sounds/finemist.mp3')
const science = require('./sounds/science.mp3')

let mapName = 'solidity';

let Resources = {
    // images
    Sword: new ex.Texture(sword),
    Spritemap: new ex.Texture(spritemap), // SpriteSheet(spritemap)
    BasicSprites: new ex.Texture(basicSprites),
    Alex: new ex.Texture(alex),
    Map: new TiledResource(`map/${mapName}.json`),
    GreatPalm: new ex.Texture(greatPalm),
    Palm: new ex.Texture(palm),

    // music
    FineMist: new ex.Sound(fineMist),
    Science: new ex.Sound(science)
}

Resources.Map.imagePathAccessor = (path, tileset) => {
    let actualPath = path.replace(/^(?:\.\.\/)+/, "");
    console.log("LOAD IMG", { path, actualPath });
    return actualPath;
    // return "/assets/" + path;
}

export { Resources }
