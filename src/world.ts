import * as ex from 'excalibur';
import { TiledResource } from '@excaliburjs/excalibur-tiled';
import { Isle, Item, ItemKind, buildItem } from './models';
import { Thing } from './actors/thing';
// import { GameConfig } from './game_config';
// import { SpriteSheet, Sprite } from 'excalibur';

// hmmmm (maybe more like a world-factory?)
class World {
    island: Isle
    tileMap: ex.TileMap
    blockingActors: Array<ex.Actor>
    // itemKindBySpriteId: { [spriteId: number]: ItemKind }

    constructor(
        public mapResource: TiledResource,
        public debugBoxes: boolean,
        //public config: GameConfig
    ) {
        this.island = new Isle('sorna');
        this._processTiledMap();
    }

    interact(it: Item): string {
        console.log("WOULD INTERACT WITH ITEM", { it });
        // it.activate();

        let { name, description } = it.kind;
        return it.activate() || description;
    }

    entityAt(x: number, y: number): Item {
        let cell = this.tileMap.getCellByPoint(x, y);
        // console.log("looking for entity at ", { x, y, cell });
        if (cell && cell['__isle_item']) {
            let it: Item = cell['__isle_item'];
            return it;
        }
        return null;
    }

    _processTiledMap() {
        let _mapRes: TiledResource = this.mapResource; // Resources.Map;
        let terrainMeta = {};
        let spriteTerrainById = {};
        let spriteCollisionById = {};
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
                    if (curr.properties) {
                        let currMeta = curr.properties.reduce((acc, curr) => {
                            let { name, value } = curr;
                            return (<any>Object).assign(acc, { [name]: value })
                        }, {});
                        return (<any>Object).assign(acc, { [curr.id]: currMeta });
                    } else {
                        console.warn("no props for sprite with id", { curr });
                        // no props for this one?
                        return acc;
                    }
                }, {})
                //console.log({ itemKindBySpriteId })
            }
        });

        this.tileMap = _mapRes.getTileMap();

        this.blockingActors = [];

        this.tileMap.data.forEach((cell: ex.Cell, index) => {

            if (cell.sprites[0]) {
                let tile = spriteTerrainById[cell.sprites[0].spriteId];
                cell = Object.assign(cell, tile);
                // we have another sprite, maybe a thing to build a box for?
                if (cell.sprites[1]) {
                    // we could use the sprite, but... also we could do something else
                    // build our own sprite with z-indexes

                    let { spriteSheetKey, spriteId } = cell.sprites[1];
                    const kind: ItemKind = itemKindBySpriteId[spriteId];

                    // we could get the image and attach it to an actor
                    const collision = spriteCollisionById[spriteId]; //cell.sprites[1].spriteId];
                    cell.removeSprite(cell.sprites[1]);

                    let sheet: ex.SpriteSheet = (<any>this.tileMap)._spriteSheets[spriteSheetKey];
                    let xOff = 16, yOff = 16;
                    let size = kind.size || 1;
                    let cellsToMark = [];
                    if (size > 1) {
                        xOff = 16 * size; yOff = 16 * size;
                        for (const x of Array(size).keys()) {
                            for (const y of Array(size).keys()) {
                                let cx = x, cy = y;
                                let cellToRemove = this.tileMap.getCellByIndex(index + cx + (cy * this.tileMap.cols));
                                if (cellToRemove.sprites[1]) {
                                    //console.log("REMOVE SPRITE FROM", {x,y,cellToRemove});
                                    cellToRemove.removeSprite(cellToRemove.sprites[1]);
                                    cellsToMark.push(cellToRemove);
                                } else {
                                    // console.warn("NO SPRITE TO REMOVE FROM", { x, y, size });
                                }
                            }
                        }
                    }

                    let z: number = (kind && kind.z) || 0;
                    let thing: Thing = new Thing(cell.x + xOff, cell.y + yOff, z, size, this.debugBoxes);

                    thing.constructCollisionArea(collision);
                    if (!thing.currentDrawing) {
                        let newSprite: ex.Sprite = sheet.getSprite(spriteId)
                        thing.addDrawing(newSprite);
                    }

                    if (kind) { // model it!
                        let theItem: Item = buildItem(kind, thing);
                        this.island.items.push(theItem);

                        //cell['__isle_item'] = theItem;
                        cellsToMark.push(cell);
                        if (cellsToMark.length) {
                            cellsToMark.forEach((c: ex.Cell) => {
                                c['__isle_item'] = theItem
                                //c.clearSprites();
                            });
                        }
                        //console.log("created item", { theItem });
                    }

                    this.blockingActors.push(thing);
                }
            }
        });
    }

}

export { World };