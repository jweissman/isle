import * as ex from 'excalibur';
import { Resources } from './resources';

const basicSprites = new ex.SpriteSheet(Resources.BasicSprites, 8, 8, 32, 32);
const greatPalm = Resources.GreatPalm.asSprite();
const palm = Resources.Palm.asSprite();

const BigCampfire = Resources.Campfire.asSprite();

//new ex.Sprite(Resources.GreatPalm.once)
export const BasicSpriteMap = {
    chestClosed: basicSprites.getSprite(2),
    chestOpen: basicSprites.getSprite(3),
    greatPalm,
    palm,

    // also used for crafting, so needs to be capitalized/match item name
    BigCampfire,

    // materials...
    wood: basicSprites.getSprite(9),
    stone: basicSprites.getSprite(15),
};