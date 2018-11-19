import * as ex from 'excalibur';
import { TileSprite } from "excalibur";
import { Thing } from "./actors/thing";
import { Resources } from './resources';

type Material = 'wood' | 'stone' | 'glass'; // | 'rope'

interface ItemKind {
    name: string
    description: string
    //public sprite: ex.Sprite,

    z?: number
    size?: number
    // alternate?: boolean
}

class Item {
    //static sprites: { [key: string]: ex.Sprite }

    constructor(
        public kind: ItemKind,
        public actor: ex.Actor,
        //public sprite: ex.Sprite,
        public state: Object = {}
    ) {
        //console.log("CREATED ITEM", { kind: this.kind, sprite: this.sprite });

    }

    activate() {
      console.warn("item is non-interactive",
          { kind: this.kind });
        return null; //'...';
    }
}

const basicSprites = new ex.SpriteSheet(Resources.BasicSprites, 8, 8, 32, 32);
const greatPalm = Resources.GreatPalm.asSprite();
const palm = Resources.Palm.asSprite();

//new ex.Sprite(Resources.GreatPalm.once)
const BasicSpriteMap = {
    chestClosed: basicSprites.getSprite(2),
    chestOpen: basicSprites.getSprite(3),
    greatPalm, //: basicSprites.getSprite
    palm,
}

class Chest extends Item {
    state: { open: boolean } = { open: false }

    constructor(kind,actor,state) {
        super(kind,actor,state);
        this.actor.addDrawing('closed', BasicSpriteMap.chestClosed);
        this.actor.addDrawing('open', BasicSpriteMap.chestOpen);
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
    constructor(kind,actor,state) {
        super(kind,actor,state);
        this.actor.addDrawing('palm', BasicSpriteMap.palm);
        this.actor.setDrawing('palm');
    }
}

class GreatPalm extends Item {
    state: { hp: number } = { hp: 100 }
    constructor(kind, actor, state) {
        super(kind, actor, state);
        this.actor.addDrawing('palm', BasicSpriteMap.greatPalm);
        this.actor.setDrawing('palm');
        console.log("CREATE GREAT PALM!!!");
    }

    activate() {
        if (this.state.hp > 0) {
            this.state.hp -= 25;
            return `once a seed (${this.state.hp}%)`
        } else {
            this.actor.kill();
            // this.actor.actions.fade(0.5, 2000);
            //setTimeout(() => this.actor.kill(), 2000);
            return "timber";
        }
    }
}

const itemClasses = {
    Chest,
    Palm,
    GreatPalm
};

const buildItem = (kind: ItemKind, actor: ex.Actor): Item => {
    if (itemClasses[kind.name]) {
        //itemClasses[kind.name].sprites[state] = sprite; //can i assign to 'static' members like that??
        return new itemClasses[kind.name](kind, actor);
    } else {
        return new Item(kind, actor);
    }
}

class Isle {
    constructor(public name: string, public items: Array<Item> = []) {
    }
}

export { Isle, Item, ItemKind, buildItem };