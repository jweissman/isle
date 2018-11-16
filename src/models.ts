import { TileSprite } from "excalibur";

type Material = 'wood' | 'stone' | 'glass'; // | 'rope'

interface ItemKind {
    name: string
    description: string
}

class Item {
    constructor(
        public kind: ItemKind,
        public sprite: ex.TileSprite,
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

class Chest extends Item {
    state: {
        open: boolean
    } = {
        open: false
    }

    activate() {
        console.log("Chest activated!", { sprite: this.sprite });

        if (this.state.open) {
            this.sprite.spriteId -= 1;
            this.state = { open: false };
            return 'closed';
        } else {
            this.sprite.spriteId += 1;
            this.state = { open: true }
            return 'opened';
        }
        // return 'sesame';
    }
}

const itemClasses = {
    Chest
};

const buildItem = (kind: ItemKind, sprite: ex.TileSprite): Item => {
    if (itemClasses[kind.name]) {
        return new itemClasses[kind.name](kind, sprite);
    } else {
        return new Item(kind, sprite);
    }
}

class Isle {
    constructor(public name: string, public items: Array<Item> = []) {
    }
}

export { Isle, Item, ItemKind, buildItem };