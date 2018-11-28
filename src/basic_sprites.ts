import * as ex from 'excalibur';
import { Resources } from './resources';

const basicSprites = new ex.SpriteSheet(Resources.BasicSprites, 16, 8, 32, 32);

const babyPalm = basicSprites.getSprite(0);
const palm = Resources.Palm.asSprite();
const greatPalm = Resources.GreatPalm.asSprite();

const babyOak = basicSprites.getSprite(12);
const oak = Resources.Oak.asSprite();
const greatOak = Resources.GreatOak.asSprite();

const pylon = Resources.Pylon.asSprite();

const stoneBlock = Resources.Stone.asSprite();
const greatStone = Resources.GreatStone.asSprite();
const stoneWall = Resources.StoneWall12.asSprite();

const waterfall = Resources.Waterfall.asSprite();

const BigCampfire = Resources.Campfire.asSprite();

//new ex.Sprite(Resources.GreatPalm.once)
export const BasicSpriteMap = {
    chestClosed: basicSprites.getSprite(2),
    chestOpen: basicSprites.getSprite(3),

    babyPalm,
    palm,
    greatPalm,

    babyOak,
    oak,
    greatOak,

    pylon,

    // also used for crafting, so needs to be capitalized/match item name
    BigCampfire,

    stoneBlock, 
    greatStone,
    stoneWall,

    waterfall,

    // materials...
    wood: basicSprites.getSprite(17), //9),
    stone: basicSprites.getSprite(23), // 15),
};