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
const BasicSpriteMap = {
    chestClosed: basicSprites.getSprite(2),
    chestOpen: basicSprites.getSprite(3),
}

class Chest extends Item {
    state: { open: boolean } = { open: false }

    constructor(kind,actor,state) {
        super(kind,actor,state);
        this.actor.addDrawing('closed', BasicSpriteMap.chestClosed);
        this.actor.addDrawing('open', BasicSpriteMap.chestOpen);
        // this.actor.setDrawing(BasicSpriteMap.chestClosed); //this.sprites.closed);
        // this.actor.setDrawing(BasicSpriteMap.chestOpen); //this.sprites.closed);
    }

    activate() {
        console.log("Chest activated!"); //, { sprite: this.sprite });
        if (this.state.open) {
            this.actor.setDrawing('closed');
            //this.sprite.spriteId -= 1;
            this.state = { open: false };
            return 'closed';
        } else {
            this.actor.setDrawing('open');
            //this.sprite.spriteId += 1;
            this.state = { open: true }
            return 'opened';
        }
        // return 'sesame';
    }
}

const itemClasses = {
    Chest
};

const buildItem = (kind: ItemKind, actor: ex.Actor, sprite: ex.Sprite): Item => {
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