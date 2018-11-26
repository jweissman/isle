import * as ex from 'excalibur';
import { Game } from '../game';
import { Material } from '../world';
import { Resources } from '../resources';
import { BasicSpriteMap } from '../basic_sprites';
import { Item } from '../models';

//class Inventory extends ex.UIActor {
//    // backpack:
//}
// inv is complex, like it's own actor/obj tree? 
const inventorySprites: { [key in Material]: ex.Sprite } = {
    [Material.Wood]: BasicSpriteMap.wood,
    [Material.Stone]: BasicSpriteMap.stone
}

class StockLine { // extends ex.UIActor {
    // spriteFont: ex.SpriteFont
    label: ex.Label
    constructor(public material: Material, public count: number, public yOff: number, public spriteFont: ex.SpriteFont) {
        //super(0, yOff * 30, 200, 20)
        

        this.label = new ex.Label(`${material} x ${count}`, 0, 0, 'Helvetica', this.spriteFont)
        this.label.fontSize = 12
        this.label.color = ex.Color.White
        //this.add(this.label)
    }

    draw(ctx, x: number, y: number) { // delta) {
        //super.draw(ctx, delta);
        let sprite = inventorySprites[this.material].clone();
        sprite.scale = new ex.Vector(0.5, 0.5)
        sprite.draw(ctx, x, y); // - 16, y - 16)

        this.label.text = `${this.material} x ${this.count}`;
        this.label.x = x + 24;
        this.label.y = y + 16;
        this.label.draw(ctx, 0);
    }
}

class Inventory extends ex.UIActor {
    lineItems: { [key in Material]: StockLine }

    constructor(public x: number, public y: number, public spriteFont: ex.SpriteFont) {
        super(x,y,100,300);

        this.lineItems = {
            [Material.Wood]: new StockLine(Material.Wood, 0, 0, spriteFont),
            [Material.Stone]: new StockLine(Material.Stone, 0, 1, spriteFont)
        }

        //Object.keys(this.lineItems).forEach(material => this.add(this.lineItems[material]));
    }

    setStock(stocks: {[key: string]: number}) {
        Object.keys(stocks).forEach((material: Material) => {
            this.lineItems[material].count = stocks[material]
        });

        // console.log("AFTER SET STOCKS", { items: this.lineItems });
    }

    draw(ctx, delta) {
        super.draw(ctx, delta);
        Object.keys(this.lineItems).forEach(
            (material: Material, index: number) =>
                this.lineItems[material].draw(ctx, this.x, this.y + index * 32)
        );
    }
}


class Hud extends ex.UIActor {
    output: ex.Label
    equipped: ex.Label

    inventory: Inventory //ex.UIActor
    spriteFont: ex.SpriteFont

    constructor(game: Game) {
        super(0, 0, game.canvasWidth, game.canvasHeight);
        this.initialize(game);
    }

    initialize(game: Game) {
        this.spriteFont = new ex.SpriteFont(
            Resources.Alphabet,
            'abcdefghijklmnopqrstuvwxyz1234567890.,!?() ',
            true,
            8, 6,
            16, 16
        )
        //this.spriteFont.useTextShadow(true);
        this.output = new ex.Label(
            '(press E to interact)',
            game.canvasWidth / 2,
            game.canvasHeight - 40,
            'Arial',
            this.spriteFont
        );
        this.output.color = ex.Color.White;
        this.output.fontSize = 48
        this.output.setWidth(game.canvasWidth);
        this.output.textAlign = ex.TextAlign.Center;

        const brand = new ex.Label('ISLE', 10, 50, 'Arial', this.spriteFont);
        brand.color = ex.Color.Azure;
        brand.fontSize = 24

        this.inventory = new Inventory(game.canvasWidth - 300, 50, this.spriteFont) // .text = 'a bunch of stuff';

        this.add(this.output);
        this.add(brand);
        this.add(this.inventory);

        this.updateInventory({
            [Material.Wood]: 0,
            [Material.Stone]: 0
        })

        this.equipped = new ex.Label('Equipped. NONE', 10, 80, 'Arial', this.spriteFont);
        this.add(this.equipped);
    }

    updateInventory(stocks: {[key: string]: number}) {
        // console.log("UPDATE INV", { stocks });
        this.inventory.setStock(stocks);
    }

    describe(description) {
      this.output.text = description;
      this.output.opacity = 1;
      this.output.actions.clearActions();
      this.output.actions.fade(0, 4000);
    }

    equip(item: Item) {
        if (item) {
            this.equipped.text = `Equipped. ${item.kind.name}`;
        } else {
            this.equipped.text = `Equipped. None`;
        }
    }
}

export { Hud };