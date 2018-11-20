import * as ex from 'excalibur';
import { Resources } from './resources';

const basicSprites = new ex.SpriteSheet(Resources.BasicSprites, 8, 8, 32, 32);
const greatPalm = Resources.GreatPalm.asSprite();
const palm = Resources.Palm.asSprite();
const campfire = Resources.Campfire.asSprite();

//new ex.Sprite(Resources.GreatPalm.once)
export const BasicSpriteMap = {
    chestClosed: basicSprites.getSprite(2),
    chestOpen: basicSprites.getSprite(3),
    greatPalm,
    palm,
    campfire,

    // materials...
    wood: basicSprites.getSprite(9),
    stone: basicSprites.getSprite(15),
};