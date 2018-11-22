import * as ex from 'excalibur';
import { Game } from '../game';
import { Material } from '../world';
import { Resources } from '../resources';
import { BasicSpriteMap } from '../basic_sprites';

//class Inventory extends ex.UIActor {
//    // backpack:
//}
// inv is complex, like it's own actor/obj tree? 
const inventorySprites: { [key in Material]: ex.Sprite } = {
    [Material.Wood]: BasicSpriteMap.wood,
    [Material.Stone]: BasicSpriteMap.stone
}

class StockLine { // extends ex.UIActor {
    label: ex.Label
    constructor(public material: Material, public count: number, public yOff: number) {
        //super(0, yOff * 30, 200, 20)

        this.label = new ex.Label(`${material} x ${count}`, 0,0, 'Arial')
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

    constructor(public x: number, public y: number) {
        super(x,y,100,300);

        this.lineItems = {
            [Material.Wood]: new StockLine(Material.Wood, 0, 0),
            [Material.Stone]: new StockLine(Material.Stone, 0, 1)
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
    inventory: Inventory //ex.UIActor

    constructor(game: Game) {
        super(0, 0, game.canvasWidth, game.canvasHeight);
        this.initialize(game);
    }

    initialize(game: Game) {
        this.output = new ex.Label(
            '(press E to interact)',
            game.canvasWidth / 2,
            game.canvasHeight - 40,
            'Arial'
        );
        this.output.color = ex.Color.White;
        this.output.fontSize = 48
        this.output.setWidth(game.canvasWidth);
        this.output.textAlign = ex.TextAlign.Center;

        const brand = new ex.Label('I S L E', 10, 50, 'Arial');
        brand.color = ex.Color.Azure;
        brand.fontSize = 24

        this.inventory = new Inventory(game.canvasWidth - 300, 50) // .text = 'a bunch of stuff';

        this.add(this.output);
        this.add(brand);
        this.add(this.inventory);

        this.updateInventory({
            [Material.Wood]: 0,
            [Material.Stone]: 0
        })
    }

    updateInventory(stocks: {[key: string]: number}) {
        console.log("UPDATE INV", { stocks });
        this.inventory.setStock(stocks);
    }

    describe(description) {
      this.output.text = description;
      this.output.opacity = 1;
      this.output.actions.clearActions();
      this.output.actions.fade(0, 2000);
    }
}

export { Hud };