import * as ex from 'excalibur';
import { World, Material } from './world';
import { Cell } from 'excalibur';
import { coinflip, range } from './util';
import { BasicSpriteMap } from './basic_sprites';

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

    activate(it?: Item) {
    //   console.warn("item is non-interactive",
    //       { kind: this.kind });
        return null; //'...';
    }
}

class Chest extends Item {
    state: { open: boolean } = { open: false }

    initialize() {
        this.actor.addDrawing('closed', BasicSpriteMap.chestClosed);
        this.actor.addDrawing('open', BasicSpriteMap.chestOpen);
        //this.actor.addDrawing();
    }

    activate(it: Item) {
        if (!it) {
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
}


class BigCampfire extends Item {
    initialize() {
        this.actor.addDrawing('fire', BasicSpriteMap.BigCampfire);
        this.actor.setDrawing('fire');
        //this.actor.setDrawing('big')
    }
}

class Pylon extends Item {
    initialize() {
        this.actor.addDrawing('pylon', BasicSpriteMap.pylon);
        this.actor.setDrawing('pylon');
    }
}

class StoneBlock extends Item {
    initialize() {
        this.actor.addDrawing('stoneblock', BasicSpriteMap.stoneBlock);
        this.actor.setDrawing('stoneblock')
    }
}

class WoodLog extends Item {
  activate(it: Item) {
      if (!it) {
          this.world.collect(this, Material.Wood);
      }
      return this.kind.description;
    }
}

class WoodLogStack extends Item {
    activate(it: Item) {
        if (!it) {
            this.world.collect(this, Material.Wood, 3);
        }
        return this.kind.description;
    }
}

class Tree extends Item {
    state: { hp: number } = { hp: 100 }

    activate(it: Item) {
        if (!it) {
            return this.kind.description;
        }

        if (this.state.hp > 0) {
            const message: string = `once a seed (${this.state.hp})`
            let damage = it && it.kind.name === 'Handaxe' ? 25 : 0; // this.world._primaryCharacter.equipped ? 30 : 3;
            this.state.hp -= damage;
            return message;
        } else {
            let basis = this.kind.size ? (this.kind.size/2) : 1;
            console.log({basis});
            let baseCells: Array<ex.Cell> = range(-basis,basis).map((offset) => //this.cell; //world.tileMap.getCellByPoint(this.actor.x, this.actor.y);
                this.world.tileMap.getCellByIndex(
                    this.cell.index +
                    (this.kind.size / 2) + offset +
                    ((this.kind.size - 1) * this.world.tileMap.cols)
                )
            );

            this.world.destroy(this);

            baseCells.forEach(base => {
                let logKind = coinflip() ? 'WoodLogStack' : 'WoodLog';

                this.world.spawn(
                    this.world.itemKinds[logKind],
                    base,
                );
            });
            return "timber";
        }
    }

}

class Palm extends Tree {
    state: { hp: number } = { hp: 25 }
    initialize() {
        this.actor.addDrawing('palm', BasicSpriteMap.palm);
        this.actor.setDrawing('palm');
    }
}

class Oak extends Tree {
    state: { hp: number } = { hp: 40 }
    initialize() {
        this.actor.addDrawing('oak', BasicSpriteMap.oak);
        this.actor.setDrawing('oak');
    }
}

class GreatPalm extends Tree {
    initialize() {
        this.actor.addDrawing('palm', BasicSpriteMap.greatPalm);
        this.actor.setDrawing('palm');
    }
}

class GreatOak extends Tree {
    initialize() {
        this.actor.addDrawing('oak', BasicSpriteMap.greatOak);
        this.actor.setDrawing('oak');
    }
}

class Handaxe extends Item {
    activate() {
        this.world.equip(this);
        this.world.destroy(this);
        return this.kind.description;
    }
}

class Machete extends Item {
    activate() {
        this.world.equip(this);
        this.world.destroy(this);
        return this.kind.description;
    }
}

const itemClasses = {
    Chest,

    Palm,
    GreatPalm,
    Oak,
    GreatOak,
    BigCampfire,
    Pylon,
    WoodLog,
    WoodLogStack,

    StoneBlock,

    Handaxe,
    Machete,
};

const buildItem = (kind: ItemKind, actor: ex.Actor, cell: Cell, world: World): Item => {
    if (itemClasses[kind.name]) {
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