import * as ex from 'excalibur';
import { Game } from '../game';
import { Material } from '../world';
import { Resources } from '../resources';
import { BasicSpriteMap } from '../basic_sprites';
import { Item } from '../models';
import { Player } from '.';
import { UIActor, Actor } from 'excalibur';

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
    constructor(
        public material: Material,
        public count: number,
        public yOff: number,
        public baseFontFamily: string,
        // public spriteFont: ex.SpriteFont
        ) {
        //super(0, yOff * 30, 200, 20)
        

        this.label = new ex.Label(`${material} x ${count}`, 0, 0, baseFontFamily); // 'Helvetica', this.spriteFont)
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

    constructor(
        public x: number,
        public y: number,
        public fontFamily: string,
        // public spriteFont: ex.SpriteFont
    ) {
        super(x,y,100,300);

        this.lineItems = {
            [Material.Wood]: new StockLine(Material.Wood, 0, 0, fontFamily), //, spriteFont),
            [Material.Stone]: new StockLine(Material.Stone, 0, 1, fontFamily) //, spriteFont)
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

class ActivePlayer extends ex.UIActor {
    currentPlayer: ex.Label
    equipped: ex.Label
    playerPortrait: ex.UIActor
    equipmentDrawing: ex.UIActor

    constructor(public x: number, public y: number, public baseFont: string) {
        super(x,y); //,64,48)

        //this.add(//new Actor()

        this.currentPlayer = new ex.Label('???', 0, 10, baseFont);
        this.currentPlayer.color = ex.Color.White;
        this.currentPlayer.fontSize = 16
        //this.currentPlayer.addDrawing(player.)
        this.add(this.currentPlayer)

        this.equipped = new ex.Label('Equipped: NONE', 0, 124, baseFont) //, this.spriteFont);
        this.equipped.color = ex.Color.White;
        this.equipped.fontSize = 16
        this.add(this.equipped);

        this.playerPortrait = new ex.UIActor(0,10); //x,y,48,48);
        this.playerPortrait.scale = new ex.Vector(2,2);
        this.add(this.playerPortrait);

        this.equipmentDrawing = new ex.UIActor(0,124);
        this.equipmentDrawing.scale = new ex.Vector(2,2)
        this.add(this.equipmentDrawing);
    }

    equip(item: Item) {
        if (item && item.kind) {
            this.equipped.text = `${item.kind.name}`;
            if (item.kind.drawing) {
                this.equipmentDrawing.addDrawing(item.kind.name, item.kind.drawing);
                this.equipmentDrawing.setDrawing(item.kind.name)
                this.add(this.equipmentDrawing);
            }
        } else {
            this.equipped.text = "(no equipment)" // `Equipped. None`;
            this.remove(this.equipmentDrawing);
            //this.equipmentDrawing.opacity = 0; //.setDrawing(null);
        }
    }

    playing(player: Player) {
        this.currentPlayer.text = `Playing: ${player.name}`
        if (player.equipped) {
            this.equip(player.equipped)
        } else {
            this.equip(null);
        }
        this.playerPortrait.addDrawing(player.name, player.portrait);
        this.playerPortrait.setDrawing(player.name);
        //this.currentPlayer.pos = new ex.Vector(200,200)
    }
}


class Hud extends ex.UIActor {
    output: ex.Label
    activePlayer: ActivePlayer
    //currentPlayer: ex.Label
    //equipped: ex.Label

    inventory: Inventory //ex.UIActor
    //spriteFont: ex.SpriteFont

    constructor(game: Game) {
        super(0, 0, game.canvasWidth, game.canvasHeight);
        this.initialize(game);
    }

    initialize(game: Game) {
        const baseFont = 'Helvetica';

        this.output = new ex.Label(
            '(press E to interact)',
            game.canvasWidth / 2,
            game.canvasHeight - 40,
            baseFont,
        );
        this.output.color = ex.Color.White;
        this.output.fontSize = 48
        this.output.setWidth(game.canvasWidth);
        this.output.textAlign = ex.TextAlign.Center;

        const brand = new ex.Label('ISLE', 20, 60, baseFont)
        brand.color = ex.Color.Azure;
        brand.fontSize = 24

        this.inventory = new Inventory(game.canvasWidth - 300, 50, baseFont) //, this.spriteFont) // .text = 'a bunch of stuff';

        this.add(this.output);
        this.add(brand);
        this.add(this.inventory);

        this.updateInventory({
            [Material.Wood]: 0,
            [Material.Stone]: 0
        })

        this.activePlayer = new ActivePlayer(20,70,baseFont);
        this.add(this.activePlayer);
        //this.currentPlayer = new ex.Label('Current Player. ???', 10, 80, baseFont);
        ////this.currentPlayer.addDrawing(player.)
        //this.add(this.currentPlayer)

        //this.equipped = new ex.Label('Equipped. NONE', 10, 80, baseFont) //, this.spriteFont);
        //this.add(this.equipped);
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
        this.activePlayer.equip(item);
    }

    playing(player: Player) {
        this.activePlayer.playing(player);
    }
}


export { Hud };