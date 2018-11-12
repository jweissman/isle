import * as ex from 'excalibur';
import TiledResource from '@excaliburjs/excalibur-tiled';

const sword = require('./images/sword.png');
const spritemap = require('./images/spritemap.png')

let Resources = {
    Sword: new ex.Texture(sword),
    Spritemap: new ex.Texture(spritemap), // SpriteSheet(spritemap)
    Map: new TiledResource("./map/example.json")
}

Resources.Map.imagePathAccessor = (path, tileset) => {
    let actualPath = path.replace(/^(?:\.\.\/)+/, "");
    console.log("LOAD IMG", { path, actualPath });
    return actualPath;
    // return "/assets/" + path;
}

export { Resources }
