import * as ex from 'excalibur';
import TiledResource from '@excaliburjs/excalibur-tiled';

const alpha = require('./images/alpha.png')
const brand = require('./images/brand.png')
// const sword = require('./images/sword.png');
const spritemap = require('./images/spritemap.png')
const basicSprites = require('./images/basic-sprites.png')

const alex = require('./images/alex-sprites.png')
const alexPortrait = require('./images/alex-portrait.png')

const miranda = require('./images/miranda-sprites.png')
const mirandaPortrait = require('./images/miranda-portrait.png')

const greatPalm = require('./images/greatpalm.png')
const palm = require('./images/palm.png')
const campfire = require('./images/campfire.png')

const fineMist = require('./sounds/finemist.mp3')
// const science = require('./sounds/science.mp3')

let mapName = 'solidity';

let Resources = {
    // app logo
    Brand: new ex.Texture(brand),

    // spritefont
    Alphabet: new ex.Texture(alpha),

    // images
    Alex: new ex.Texture(alex),
    AlexPortrait: new ex.Texture(alexPortrait),
    Miranda: new ex.Texture(miranda),
    MirandaPortrait: new ex.Texture(mirandaPortrait),

    //Sword: new ex.Texture(sword),
    Spritemap: new ex.Texture(spritemap), // SpriteSheet(spritemap)
    BasicSprites: new ex.Texture(basicSprites),
    Map: new TiledResource(`map/${mapName}.json`),
    GreatPalm: new ex.Texture(greatPalm),
    Palm: new ex.Texture(palm),
    Campfire: new ex.Texture(campfire),

    // music
    FineMist: new ex.Sound(fineMist),
    // Science: new ex.Sound(science)
}

Resources.Map.imagePathAccessor = (path, tileset) => {
    let actualPath = path.replace(/^(?:\.\.\/)+/, "");
    // console.log("LOAD IMG", { path, actualPath });
    return actualPath;
    // return "/assets/" + path;
}

export { Resources }
