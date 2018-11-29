import * as ex from 'excalibur';
import { TiledResource } from '@excaliburjs/excalibur-tiled';
import { Isle, Item, ItemKind, buildItem } from './models';
import { Thing } from './actors/thing';
import { Resources } from './resources';
import { Player } from './actors';
import { GameConfig } from './game_config';
import { Hud } from './actors/hud';

type Entity = Item | Player

// type CellContents = Entity[]

// maybe goes in models??
export enum Material {
    Wood = 'wood',
    Stone = 'stone',
}

type Stocks = { [key in Material]: number }

class World {
    island: Isle
    tileMap: ex.TileMap
    itemKinds: { [key: string]: ItemKind }
    playerCharacterMeta: { [name: string]: {
        sprites: ex.SpriteSheet,
        portrait: ex.Sprite,
        primary: boolean
    }}
    debugBoxes: boolean

    spriteCollisionById: object = {};
    characterById: object = {};
    itemKindBySpriteId: { [spriteId: number]: ItemKind } = {};



    // craft state...
    crafting: boolean
    craftingItem: string
    craftingAt: { x: number, y: number }

    stocks: Stocks

    constructor(
        public scene: ex.Scene,
        public hud: Hud,
        public config: GameConfig,
        protected engine: ex.Engine
    ) {
        this.island = new Isle('sorna');
        this.itemKinds = {};
        this.playerCharacterMeta = {
            Alex: {
                sprites: new ex.SpriteSheet(Resources.Alex, 4, 7, 32, 64),
                portrait: Resources.AlexPortrait.asSprite(),
                primary: true
            },
            Miranda: {
                sprites: new ex.SpriteSheet(Resources.Miranda, 4, 7, 32, 64),
                portrait: Resources.MirandaPortrait.asSprite(),
                primary: false
            }
        }
        this.debugBoxes = config.debugBoundingBoxes;

        this.stocks = {
            wood: 0,
            stone: 0,
        }
    }

    // askYesNo(question: string): boolean {
    //     //this.os
    //     return false;
    // }

    enterCraftMode(itemName: string, x: number, y: number) {
        this.crafting = true;
        this.craftingItem = itemName;
        this.craftingAt = { x, y };
    }

    equip(it: Item) {
        if (this._primaryCharacter.equipped) {
            // drop current item
            this.spawn(this._primaryCharacter.equipped.kind, this.playerCell())
        }
        this._primaryCharacter.equip(it);
        this.hud.equip(it);
    }

    collect(it: Item, material: Material, count: number = 1) {
    //   console.log("WOULD COLLECT ITEM", { it, material, count });
      this.destroy(it);
      this.stocks[material] += count;
      this.hud.updateInventory(this.stocks);
    //   console.log("AFTER COLLECT ITEM", { it, material, count, stocks: this.stocks });
    }

    debit(material: Material, count: number = 1) {
        this.stocks[material] -= count;
        this.hud.updateInventory(this.stocks);
    }

    // need to remove it from the cell...?
    //

    interact(it: Entity, cell: ex.Cell): string {
        if (it instanceof Item) {
            // console.log("WOULD INTERACT WITH ITEM", { it });
            let { name, description } = it.kind;
            return it.activate() || description;
        } else if (it instanceof Player) {
            let currentPc = this._primaryCharacter;
            let message = `nice to see you again, ${currentPc.name}`;
            cell['__isle_pc'] = currentPc;
            currentPc.x = cell.x
            currentPc.y = cell.y
            currentPc.move('down');
            currentPc.halt();
            //cell.removeSprite(cell.sprites[1]);
            // todo remove new pc from cell, add old pc TO that cell...
            this.makePrimaryCharacter(it);
            return message;
        }
    }

    useItem(it: Entity, cell: ex.Cell, equipment: Item): string {
        if (it instanceof Item) {
            let msg = it.activate(equipment) || `use ${equipment.kind.name} on ${it.kind.name} `;
            this.hud.describe(msg);
            return msg;

        }
    }

    entityAt(x: number, y: number): { entity: Entity, cell: ex.Cell } {
        let cell = this.tileMap.getCellByPoint(x, y);
        // console.log("looking for entity at ", { x, y, cell });
        if (cell) {
            if (cell['__isle_items'] && cell['__isle_items'].length) {
                let it: Item = cell['__isle_items'][0]; // just hand back first for now??
                return { entity: it, cell };
            } else if (cell['__isle_pc']) {
                let pc: Player = cell['__isle_pc'];
                return { entity: pc, cell };
            }
        }
        return null;
    }

    entityNear(x: number, y: number, tol: number = 8): { entity: Entity, cell: ex.Cell} {
        return this.entityAt(x, y) ||
            this.entityAt(x, y + tol) ||
            this.entityAt(x, y - tol) ||
            this.entityAt(x - tol, y) ||
            this.entityAt(x + tol, y)
    }

    entitiesNear(x: number, y: number, tol: number = 32): Array<{ entity: Entity, cell: ex.Cell }> {
        let positions = [
            {x,y},
            {x, y: y + tol},
            {x, y: y - tol},
            {x: x - tol, y},
            {x: x + tol, y}
        ]

        return positions
            .map(pos => this.entityNear(pos.x, pos.y))
            .filter(Boolean);

    }

    destroy(it: Item) {
        let { kind, cell } = it;
        let { size, width } = kind;
        width = width || size;
        console.log("DESTROY", { it, kind: it.kind.name, size, width });
        for (const x of Array(width).keys()) {
            for (const y of Array(size).keys()) {
                let cellToMark = this.tileMap.getCellByIndex(cell.index + x + (y * this.tileMap.cols));
                if (cellToMark['__isle_items'].find(item => it === item)) { // ==.kind === kind) {
                    cellToMark['__isle_items'] = cellToMark['__isle_items'].filter(item => it !== item);
                }
            }
        }

        it.actor.kill();

        return true;
    }

    spawn(kind: ItemKind, cell: ex.Cell, layer: number = 0): Thing {
        let { size, width } = kind;
        size = size || 1;
        width = width || size;

        let x = cell.x + 16 * width;
        let y = cell.y + 16 * size;
        let thing: Thing = new Thing(x, y, width, size, layer, this.debugBoxes);

        if (kind.drawing) {
          thing.addDrawing(kind.drawing);
        }

        thing.constructCollisionArea(kind.collision);

        let theItem: Item = buildItem(kind, thing, cell, this);
        this.island.items.push(theItem);
        for (const x of Array(width).keys()) {
            for (const y of Array(size).keys()) {
                let cellToMark = this.tileMap.getCellByIndex(cell.index + x + (y * this.tileMap.cols));

                cellToMark['__isle_items'] = cellToMark['__isle_items'] || []; //.push(theItem);
                cellToMark['__isle_items'].push(theItem);
            }
        }

        this.scene.add(thing);
        thing.setZIndex(thing.computeZ());
        console.log(`SPAWN ${kind.name}`, { kind, thing });
        return thing;
    }

    _primaryCharacter: Player
    createPlayableCharacter(name: string, cell: ex.Cell) { // x: number, y: number) {
        let pcMeta = this.playerCharacterMeta[name];
        if (pcMeta) {
            let { x, y } = cell;
            // console.log("CREATE PC", { pcMeta });
            const pc = new Player(
                name,
                x, y,
                this.config,
                pcMeta.sprites,
                pcMeta.portrait,
                this.engine
            );
            pc.wireWorld(this);
            this.scene.add(pc);
            if (pcMeta.primary) {
                this.makePrimaryCharacter(pc);
            } else {
                // console.log("PC is not primary", { pcMeta });
                cell['__isle_pc'] = pc;
            }
        }
    }

    makePrimaryCharacter(pc: Player) {
        this._primaryCharacter = pc;
        pc.move('down');
        pc.halt();

        // fix cam!
        this.scene.camera.strategy.lockToActor(pc);
        this.scene.camera.zoom(this.config.zoom);

        // tell hud
        this.hud.playing(pc);
    }

    primaryCharacter() {
        return this._primaryCharacter;
    }

    playerCell() {
        return this.tileMap.getCellByPoint(
            this._primaryCharacter.x,
            this._primaryCharacter.y
        )
    }

    processTiledMap(mapResource: TiledResource) {
        let _mapRes: TiledResource = mapResource;
        let terrainMeta = {};
        let spriteTerrainById = {};
        _mapRes.data.tilesets.forEach((ts) => {
            if (ts.terrains) {
                ts.terrains.forEach((terrain, index) => {
                    if (terrain.properties) {
                        let tile = index; // terrain.tile; // terrain tiles lie?
                        terrainMeta[tile] = terrain.properties.reduce((acc, curr) => {
                            let { name, value } = curr;
                            return (<any>Object).assign(acc, { [name]: value })
                        }, {});
                        terrainMeta[tile].terrainName = terrain.name;
                    }
                });

                spriteTerrainById = ts.tiles.reduce((acc, curr) => {
                    let { terrain, id } = curr;
                    const solid = terrain.every(tile => terrainMeta[tile] && terrainMeta[tile].solid);
                    let terrainTile = { solid };
                    return (<any>Object).assign(acc, { [id]: terrainTile });
                }, {});
            }

            if (ts.tiles && ts.tiles.some(tile => tile.objectgroup)) {
                this.spriteCollisionById = ts.tiles.reduce((acc, curr) => {
                    let { objectgroup, id } = curr;
                    if (objectgroup && objectgroup.objects && objectgroup.objects.length) {
                        return (<any>Object).assign(acc, { [id]: objectgroup.objects[0] });
                    } else {
                        return acc;
                    }
                }, {});

                this.itemKindBySpriteId = ts.tiles.reduce((acc, curr) => {
                    if (curr.properties && !curr.properties.some(prop => prop.name === 'character')) {
                        let currMeta = curr.properties.reduce((acc, curr) => {
                            let { name, value } = curr;
                            return (<any>Object).assign(acc, { [name]: value })
                        }, {});
                        return (<any>Object).assign(acc, { [curr.id]: currMeta });
                    } else {
                        console.warn("no props for sprite with id (or maybe char?)", { curr });
                        // no props for this one?
                        return acc;
                    }
                }, {})
                
            }

            let hasCharacters = ts.tiles &&
                ts.tiles.some(tile => tile.properties && tile.properties.some(prop => prop.name === 'character'));

            if (hasCharacters) {
                this.characterById = ts.tiles.reduce((acc, curr) => {
                    if (curr.properties && curr.properties.some(prop => prop.name === 'character')) {
                        let charProp = curr.properties.find(prop => prop.name === 'character');
                        let name = charProp.value;
                        return (<any>Object.assign(acc, {
                            [curr.id]: name
                        }));
                    } else {
                        return acc;
                    }
                }, {});
            } else {
                console.warn('no player characters in tileset!', { tiles: ts.tiles })
            }
        });

        this.tileMap = _mapRes.getTileMap();

        this.tileMap.data.forEach((cell: ex.Cell, cellIndex: number) => {
            if (cell.sprites[0]) {
                let terrainSpriteId = cell.sprites[0].spriteId;
                let tile = spriteTerrainById[terrainSpriteId];
                if (tile) {
                    cell = Object.assign(cell, tile);
                }
            }

            if (cell.sprites.length > 0) {
                for (let spIndex = 1; spIndex < cell.sprites.length; spIndex++) {
                    this.processTileSprite(cell, spIndex, cellIndex);
                }

                for (let spIndex = 1; spIndex < cell.sprites.length; spIndex++) {
                    cell.removeSprite(cell.sprites[spIndex]);
                }
            }
        });
    }

    processTileSprite(cell: ex.Cell, spriteIndex: number, cellIndex: number) {
        let theSprite = cell.sprites[spriteIndex];

        let { spriteSheetKey, spriteId } = theSprite;
        const kind: ItemKind = this.itemKindBySpriteId[spriteId];

        if (!kind) {
            const characterName: string = this.characterById[spriteId];
            if (characterName) {
                console.log("WOULD CREATE PLAYABLE CHARACTER", { characterName, cell });
                this.createPlayableCharacter(characterName, cell);
            } else {
                console.warn("CELL has sprite with no kind or character", { cell, items: this.itemKindBySpriteId, characters: this.characterById });
            }
            return;
        } // hm

        this.itemKinds[kind.name] = kind;

        let size = kind.size || 1;
        let width = kind.width || kind.size;
        if (size > 1) {
            console.log("clear space for object", { size, width })
            for (const x of Array(width).keys()) {
                for (const y of Array(size).keys()) {
                    let cx = x, cy = y;
                    let cellToRemove = this.tileMap.getCellByIndex(cellIndex + cx + (cy * this.tileMap.cols));

                    for (let spIndex = 1; spIndex < cellToRemove.sprites.length; spIndex++) {
                        // we basically want to remove all sprites anyway right??
                        // (this seems way too drastic, i'm not sure how it's working)
                        cellToRemove.removeSprite(cellToRemove.sprites[spIndex]);
                    }
                    //if (cellToRemove.sprites[1]) {
                    //    let otherSpriteId = cellToRemove.sprites[1].spriteId;
                    //    let otherKind = this.itemKindBySpriteId[otherSpriteId];
                    //    // hmm -- could check if it's even the same kind of thing...?
                    //    if (otherKind === kind) {

                    //        cellToRemove.removeSprite(cellToRemove.sprites[1]);
                    //    }
                    //} else {
                    //}
                }
            }
        }

        // we could get the image and attach it to an actor
        const collision = this.spriteCollisionById[spriteId];
        kind.collision = collision;

        let sheet: ex.SpriteSheet = (<any>this.tileMap)._spriteSheets[spriteSheetKey];
        let newSprite: ex.Sprite = sheet.getSprite(spriteId)
        kind.drawing = newSprite;

        this.spawn(kind, cell);
    }

}

export { World };