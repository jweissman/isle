import * as ex from 'excalibur';
import { Resources } from './resources';
import { World } from './world';
import { Cell } from 'excalibur';
import { coinflip } from './util';

//type Material = 'wood' | 'stone' | 'glass'; // | 'rope'

interface ItemKind {
    name: string
    description: string
    //public sprite: ex.Sprite,

    z?: number
    size?: number

    drawing?: ex.Sprite
    collision?: any
    // alternate?: boolean
}

class Item {
    //static sprites: { [key: string]: ex.Sprite }

    constructor(
        public kind: ItemKind,
        public actor: ex.Actor,
        public cell: ex.Cell, // the 'root' cell (upper-left corner of large objs)
        //public sprite: ex.Sprite,
        //public state: Object = {},
        public world: World
    ) {
        //console.log("CREATED ITEM", { kind: this.kind, sprite: this.sprite });
        this.initialize();
    }

    initialize() {}

    activate() {
      console.warn("item is non-interactive",
          { kind: this.kind });
        return null; //'...';
    }
}

const basicSprites = new ex.SpriteSheet(Resources.BasicSprites, 8, 8, 32, 32);
const greatPalm = Resources.GreatPalm.asSprite();
const palm = Resources.Palm.asSprite();
const campfire = Resources.Campfire.asSprite();

//new ex.Sprite(Resources.GreatPalm.once)
const BasicSpriteMap = {
    chestClosed: basicSprites.getSprite(2),
    chestOpen: basicSprites.getSprite(3),
    greatPalm, //: basicSprites.getSprite
    palm,
    campfire,
}


class Chest extends Item {
    state: { open: boolean } = { open: false }

    initialize() {
        this.actor.addDrawing('closed', BasicSpriteMap.chestClosed);
        this.actor.addDrawing('open', BasicSpriteMap.chestOpen);
        //this.actor.addDrawing();
    }

    activate() {
        console.log("Chest activated!");
        if (this.state.open) {
            this.actor.setDrawing('closed');
            this.state = { open: false };
            return 'closed';
        } else {
            this.actor.setDrawing('open');
            this.state = { open: true }
            return 'opened';
        }
    }
}

class Palm extends Item {
    initialize() {
        this.actor.addDrawing('palm', BasicSpriteMap.palm);
        this.actor.setDrawing('palm');
    }
}

class BigCampfire extends Item {
    initialize() {
        this.actor.addDrawing('fire', BasicSpriteMap.campfire);
        this.actor.setDrawing('fire');
        //this.actor.setDrawing('big')
    }
}

//class WoodLogStack extends Item {}

class GreatPalm extends Item {
    state: { hp: number } = { hp: 100 }

    initialize() {
        this.actor.addDrawing('palm', BasicSpriteMap.greatPalm);
        this.actor.setDrawing('palm');
    }

    activate() {
        if (this.state.hp > 0) {
            const message: string = `once a seed (${this.state.hp}%)`
            this.state.hp -= 30;
            return message;
        } else {
            let baseCells: Array<ex.Cell> = [-2,-1,0,1,2].map((offset) => //this.cell; //world.tileMap.getCellByPoint(this.actor.x, this.actor.y);
                this.world.tileMap.getCellByIndex(
                    this.cell.index +
                    (this.kind.size / 2) + offset +
                    ((this.kind.size - 1) * this.world.tileMap.cols)
                )
            );
            // cell.clearSprites();

            this.world.destroy(this);

            baseCells.forEach(base => {
                let logKind = coinflip() ? 'WoodLogStack' : 'WoodLog';
                let newThing = this.world.spawn(
                    this.world.itemKinds[logKind],
                    base,
                );
                console.log("TIMBER", { base, newThing }); //, newThing });
            });
            //this.actor.actions..fade(0.5, 2000);
            // setTimeout(() => this.world.destroy(this), 2000);
            return "timber";
        }
    }
}

const itemClasses = {
    Chest,
    Palm,
    GreatPalm,
    BigCampfire,
    //Lumber
};

const buildItem = (kind: ItemKind, actor: ex.Actor, cell: Cell, world: World): Item => {
    if (itemClasses[kind.name]) {
        //itemClasses[kind.name].sprites[state] = sprite; //can i assign to 'static' members like that??
        return new itemClasses[kind.name](kind, actor, cell, world);
    } else {
        return new Item(kind, actor, cell, world);
    }
}

class Isle {
    constructor(public name: string, public items: Array<Item> = []) {
    }
}

export { Isle, Item, ItemKind, buildItem };