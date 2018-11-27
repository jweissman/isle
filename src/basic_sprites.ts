import * as ex from 'excalibur';
import { Resources } from './resources';

const basicSprites = new ex.SpriteSheet(Resources.BasicSprites, 8, 8, 32, 32);

const palm = Resources.Palm.asSprite();
const greatPalm = Resources.GreatPalm.asSprite();

const oak = Resources.Oak.asSprite();
const greatOak = Resources.GreatOak.asSprite();

const pylon = Resources.Pylon.asSprite();
const stoneBlock = Resources.Stone.asSprite();

const BigCampfire = Resources.Campfire.asSprite();

//new ex.Sprite(Resources.GreatPalm.once)
export const BasicSpriteMap = {
    chestClosed: basicSprites.getSprite(2),
    chestOpen: basicSprites.getSprite(3),

    palm,
    greatPalm,

    oak,
    greatOak,

    pylon,

    // also used for crafting, so needs to be capitalized/match item name
    BigCampfire,

    stoneBlock, 

    // materials...
    wood: basicSprites.getSprite(9),
    stone: basicSprites.getSprite(15),
};