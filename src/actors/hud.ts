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

class StockLine extends ex.UIActor {
    label: ex.Label
    constructor(public material: Material, public count: number, public yOff: number) {
        super(0, yOff * 30, 200, 20)

        this.label = new ex.Label(`${material} x ${count}`, this.x, this.y, 'Arial')
        this.label.fontSize = 12
        this.label.color = ex.Color.White
        this.add(this.label)
    }
    
    draw(ctx, delta) {
        super.draw(ctx, delta);
        let sprite = inventorySprites[this.material].clone();
        sprite.scale = new ex.Vector(0.5, 0.5)
        sprite.draw(ctx, this.x, this.y)
    }
}

// yeah we need an inventory ui actor layer :)

class Hud extends ex.UIActor {
    output: ex.Label
    inventory: ex.UIActor

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

        // this.inventory = new ex.Label('(inventory)', game.canvasWidth - 300, 40, 'Arial')
        // this.inventory.color = ex.Color.Green;
        // this.inventory.fontSize = 24
        this.inventory = new ex.UIActor(game.canvasWidth - 300, 50, 300, 500) // .text = 'a bunch of stuff';

        this.add(this.output);
        this.add(brand);
        this.add(this.inventory);

        this.updateInventory({
            [Material.Wood]: 0,
            [Material.Stone]: 0
        })
    }

    updateInventory(stocks: {[key: string]: number}) {
        let stockLines: StockLine[] = Object.keys(stocks).map(
            (material: Material, index) => new StockLine(material, stocks[material], index) //`${material} x${stocks[material]}`
        );
        stockLines.forEach(line => this.inventory.add(line));
        console.log("update inventory", { stocks, stockLines });
        this.inventory.children.forEach(child => this.inventory.remove(child))
        
        stockLines.forEach(line => this.inventory.add(line))
        // rebuild??
    }

    //update(engine, delta) {
    //    //super(engine, delta);
    //}

    describe(description) {
      this.output.text = description;
      this.output.opacity = 1;
      this.output.actions.clearActions();
      this.output.actions.fade(0, 2000);
    }
}

export { Hud };