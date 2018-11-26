import * as ex from 'excalibur';
import { TiledResource } from '@excaliburjs/excalibur-tiled';
import { Isle, Item, ItemKind, buildItem } from './models';
import { Thing } from './actors/thing';
import { Resources } from './resources';
import { Player } from './actors';
import { GameConfig } from './game_config';
import { Hud } from './actors/hud';

type Entity = Item | Player

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
        primary: boolean
    }}
    debugBoxes: boolean

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
                primary: true
            },
            Miranda: {
                sprites: new ex.SpriteSheet(Resources.Miranda, 4, 7, 32, 64),
                primary: false
            }
        }
        this.debugBoxes = config.debugBoundingBoxes;

        this.stocks = {
            wood: 0,
            stone: 0,
        }
    }

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
      console.log("WOULD COLLECT ITEM", { it, material, count });
      this.destroy(it);
      this.stocks[material] += count;
      this.hud.updateInventory(this.stocks);
      console.log("AFTER COLLECT ITEM", { it, material, count, stocks: this.stocks });
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
            // console.log("WOULD SWAP PLAYER CHARACTER!!!", {it});
            let currentPc = this._primaryCharacter;
            let message = `nice to see you again, ${currentPc.name}`;
            cell['__isle_pc'] = currentPc;
            currentPc.x = cell.x
            currentPc.y = cell.y //+16 //-48
            currentPc.move('down');
            currentPc.halt();
            //cell.removeSprite(cell.sprites[1]);
            // todo remove new pc from cell, add old pc TO that cell...
            this.makePrimaryCharacter(it);
            this.hud.equip(it.equipped);
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
            if (cell['__isle_item']) {
                let it: Item = cell['__isle_item'];
                return { entity: it, cell };
            } else if (cell['__isle_pc']) {
                let pc: Player = cell['__isle_pc'];
                return { entity: pc, cell };
            }
        }
        return null;
    }

    entityNear(x: number, y: number): { entity: Entity, cell: ex.Cell} {
        return this.entityAt(x, y) ||
            this.entityAt(x, y + 10) ||
            this.entityAt(x, y - 10) ||
            this.entityAt(x - 10, y) ||
            this.entityAt(x + 10, y)
    }

    destroy(it: Item) {
        console.log("DESTROY", { it });
        let { kind, cell } = it;
        let { size } = kind;
        for (const x of Array(size).keys()) {
            for (const y of Array(size).keys()) {
                let cellToMark = this.tileMap.getCellByIndex(cell.index + x + (y * this.tileMap.cols));
                // remove item from list...
                cellToMark['__isle_item'] = null;
            }
        }

        it.actor.kill();

        return true;
    }

    spawn(kind: ItemKind, cell: ex.Cell): Thing {
        let { size } = kind;
        size = size || 1;

        let x = cell.x + 16 * size;
        let y = cell.y + 16 * size;
        let thing: Thing = new Thing(x, y, size, size, this.debugBoxes);

        if (kind.drawing) {
          thing.addDrawing(kind.drawing);
        }

        thing.constructCollisionArea(kind.collision);

        let theItem: Item = buildItem(kind, thing, cell, this);
        this.island.items.push(theItem);
        for (const x of Array(size).keys()) {
            for (const y of Array(size).keys()) {
                let cellToMark = this.tileMap.getCellByIndex(cell.index + x + (y * this.tileMap.cols));
                cellToMark['__isle_item'] = theItem;
            }
        }

        this.scene.add(thing);
        thing.setZIndex(thing.computeZ());
        // console.log(`SPAWN ${kind.name}`, { kind, thing });
        return thing;
    }

    _primaryCharacter: Player
    createPlayableCharacter(name: string, cell: ex.Cell) { // x: number, y: number) {
        let pcMeta = this.playerCharacterMeta[name];
        if (pcMeta) {
            let { x, y } = cell;
            console.log("CREATE PC", { pcMeta });
            const pc = new Player(name, x, y, this.config, pcMeta.sprites, this.engine);
            pc.wireWorld(this);
            this.scene.add(pc);
            cell['__isle_pc'] = pc;
            if (pcMeta.primary) {
                this.makePrimaryCharacter(pc);
            } else {
                console.log("PC is not primary", { pcMeta });
            }
        }
    }

    makePrimaryCharacter(pc: Player) {
        console.log("CREATE PRIMARY PC!!!", { pc });
        this._primaryCharacter = pc;
        pc.move('down');
        pc.halt();
        //pc.facing = 'down';
        // fix cam!
        this.scene.camera.strategy.lockToActor(pc);
        this.scene.camera.zoom(this.config.zoom);
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
        let _mapRes: TiledResource = mapResource; // Resources.Map;
        let terrainMeta = {};
        let spriteTerrainById = {};
        let spriteCollisionById = {};

        let characterById = {};

        let itemKindBySpriteId: { [spriteId: number]: ItemKind } = {};

        _mapRes.data.tilesets.forEach((ts) => {
            //console.log("TILESET", { ts });
            if (ts.terrains) {
                ts.terrains.forEach(terrain => {
                    if (terrain.properties) {
                        terrainMeta[terrain.tile] = terrain.properties.reduce((acc, curr) => {
                            let { name, value } = curr;
                            return (<any>Object).assign(acc, { [name]: value })
                        }, {});

                        terrainMeta[terrain.tile].terrainName = terrain.name;

                        console.log(
                            `terrain ${terrain.name} (${terrain.tile}) has props: `,
                            terrainMeta[terrain.tile]
                        )
                    }
                });

                spriteTerrainById = ts.tiles.reduce((acc, curr) => {
                    let { terrain, id } = curr;
                    const solid = terrain.every(tile => terrainMeta[tile] && terrainMeta[tile].solid); // : false);
                    let terrainTile = { solid };
                    // console.log(`terrain set for ${id}`, { solid }, terrain.map(tile => terrainMeta[tile]))
                    return (<any>Object).assign(acc, { [id]: terrainTile });
                }, {});

                // console.log({ terrainMeta, spriteTerrainById });
            }

            // console.log({tiles: ts.tiles})
            if (ts.tiles && ts.tiles.some(tile => tile.objectgroup)) {
                // should also grab item/obj metadata here?
                // console.log("todo -- extract obj group collision frame?");
                //debugger;
                spriteCollisionById = ts.tiles.reduce((acc, curr) => {
                    let { objectgroup, id } = curr;
                    if (objectgroup && objectgroup.objects && objectgroup.objects.length) {
                        return (<any>Object).assign(acc, { [id]: objectgroup.objects[0] });
                    } else {
                        return acc;
                    }
                }, {});

                console.log({ spriteCollisionById });
                console.log({ ts });

                itemKindBySpriteId = ts.tiles.reduce((acc, curr) => {
                    // debugger;
                    //console.log({ curr });
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
                //console.log({ itemKindBySpriteId })

                
            }

            if (ts.tiles && ts.tiles.some(tile => tile.properties && tile.properties.some(prop => prop.name === 'character'))) {
                // console.log('character somewhere!!');
                characterById = ts.tiles.reduce((acc, curr) => {
                    if (curr.properties && curr.properties.some(prop => prop.name === 'character')) {
                        // console.log('char found!', { curr });
                        let charProp = curr.properties.find(prop => prop.name === 'character');
                        let name = charProp.value;
                        return (<any>Object.assign(acc, {
                            [curr.id]: name // charProp.value // curr.properties.character.name
                        }));
                    } else {
                        return acc;
                    }
                }, {});
                console.log({ characterById });
            } else {
                console.warn('no chars in tileset', { tiles: ts.tiles })
            }
        });

        this.tileMap = _mapRes.getTileMap();

        // this.blockingActors = [];

        this.tileMap.data.forEach((cell: ex.Cell, index) => {

            if (cell.sprites[0]) {
                let tile = spriteTerrainById[cell.sprites[0].spriteId];
                cell = Object.assign(cell, tile);
                // we have another sprite, maybe a thing to build a box for?
                if (cell.sprites[1]) {
                    // we could use the sprite, but... also we could do something else
                    // build our own sprite with z-indexes
                    // better yet: spawn an entity

                    let { spriteSheetKey, spriteId } = cell.sprites[1];
                    cell.removeSprite(cell.sprites[1]); //hhclearSprites();
                    const kind: ItemKind = itemKindBySpriteId[spriteId];
                    if (!kind) {
                        const characterName: string = characterById[spriteId];
                        if (characterName) {
                            console.log("WOULD CREATE PLAYABLE CHARACTER", {characterName, cell});
                            this.createPlayableCharacter(characterName, cell); // cell.x, cell.y);
                        } else {
                            console.warn("CELL has sprite with no kind or character", { cell, itemKindBySpriteId, characterById });
                        }
                        return;
                    } // hm
                    this.itemKinds[kind.name] = kind;

                    // we could get the image and attach it to an actor
                    const collision = spriteCollisionById[spriteId]; //cell.sprites[1].spriteId];
                    //cell.removeSprite(cell.sprites[1]);

                    let sheet: ex.SpriteSheet = (<any>this.tileMap)._spriteSheets[spriteSheetKey];
                    // let xOff = 16, yOff = 16;
                    let size = kind.size || 1;
                    //let cellsToMark = [];
                    if (size > 1) {
                        // xOff = 16 * size; yOff = 16 * size;
                        for (const x of Array(size).keys()) {
                            for (const y of Array(size).keys()) {
                                let cx = x, cy = y;
                                let cellToRemove = this.tileMap.getCellByIndex(index + cx + (cy * this.tileMap.cols));
                                if (cellToRemove.sprites[1]) {
                                    //console.log("REMOVE SPRITE FROM", {x,y,cellToRemove});
                                    cellToRemove.removeSprite(cellToRemove.sprites[1]);
                                    //cellsToMark.push(cellToRemove);
                                } else {
                                    // console.warn("NO SPRITE TO REMOVE FROM", { x, y, size });
                                }
                            }
                        }
                    }

                    // let z: number = (kind && kind.z) || 0;
                    kind.collision = collision;
                    let newSprite: ex.Sprite = sheet.getSprite(spriteId)
                    kind.drawing = newSprite; 

                    // let thing: Thing = 
                    this.spawn(kind, cell);
                }
            }
        });

        // console.log({ itemKinds: this.itemKinds });
    }

}

export { World };