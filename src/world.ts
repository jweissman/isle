import * as ex from 'excalibur';
import TiledResource from '@excaliburjs/excalibur-tiled';
import { Isle, Item, ItemKind } from './models';

// hmmmm (maybe more like a world-factory?)
class World {
    island: Isle
    tileMap: ex.TileMap
    blockingActors: Array<ex.Actor>
    // itemKindBySpriteId: { [spriteId: number]: ItemKind }

    constructor(public mapResource: TiledResource, public debugBoxes: boolean) {
        this.island = new Isle('sorna');

        this._processTiledMap();
    }

    entityAt(x: number, y: number): Item {
        let cell = this.tileMap.getCellByPoint(x, y); //interactionPos.x, interactionPos.y);
        //console.log(
        //  "WOULD ATTEMPT TO INTERACT IN DIRECTION w/ CELL: ", 
        //  { dir: this.facing, cell }
        //);
        if (cell.sprites.length > 1) {
            //console.log("goodness, there is something there!!!", cell);
            let it : Item = cell['__isle_item'];
            return it; //cell['__isle_item']; // sprites[1] };
            //  // we need to build some kind of object model we can deref
            //  // all we'll have is a spriteId...
        }
        return null; // { nothing: 'to see here' };

    }

    _processTiledMap() {
        let _mapRes = this.mapResource; // Resources.Map;
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

                itemKindBySpriteId = ts.tiles.reduce((acc, curr) => {
                    if (curr.properties) {
                        let currMeta = curr.properties.reduce((acc, curr) => {
                            let { name, value } = curr;
                            return (<any>Object).assign(acc, { [name]: value })
                        }, {});
                        return (<any>Object).assign(acc, { [curr.id]: currMeta });
                    } else {
                        console.warn("no props for sprite with id", {curr});
                        // no props for this one?
                        return acc;
                    }
                }, {})
                console.log({ itemKindBySpriteId })
            }
        });

        this.tileMap = _mapRes.getTileMap();

        this.blockingActors = [];

        this.tileMap.data.forEach((cell: ex.Cell) => {

            if (cell.sprites[0]) {
                let tile = spriteTerrainById[cell.sprites[0].spriteId];
                cell = Object.assign(cell, tile);
                // cell.height = cell.y;

                // we have another sprite, maybe a thing to build a box for?
                if (cell.sprites[1]) {
                    const spriteId = cell.sprites[1].spriteId;
                    // console.log("processing cell with spriteId", { spriteId });
                    const collision = spriteCollisionById[spriteId]; //cell.sprites[1].spriteId];
                    if (collision) {
                        let block = new ex.Actor(cell.x, cell.y, 32, 32);
                        // + collision.x, cell.y + collision.y, 32, 32);
                        block.collisionType = ex.CollisionType.Fixed;
                        if (collision.ellipse) {
                            let center = new ex.Vector(
                                    collision.x + collision.width/2,
                                    collision.y + collision.height/2,
                                )
                            block.body.useCircleCollision(
                                collision.height / 2,
                                center
                            );
                        } else if (collision.polygon) {
                            //console.log("poly", { polygon: collision.polygon });
                            //debugger;
                            let vecs : ex.Vector[] = collision.polygon.map(
                                ({ x, y }) => new ex.Vector(
                                    x + collision.x,
                                    y + collision.y
                                )
                            );

                            block.body.usePolygonCollision(
                                vecs
                            )
                        } else {
                            console.warn("implement collider:", { collision })
                            //debugger;
                        }
                        if (this.debugBoxes) {
                            // console.log({ collision, block });
                            block.draw = (ctx) => {
                                block.collisionArea.debugDraw(ctx, ex.Color.LightGray);
                            }
                        }
                        //console.log({collision});
                        this.blockingActors.push(block);

                        // de-ref from sprite id
                        const kind: ItemKind = itemKindBySpriteId[spriteId];
                        //debugger;
                        if (kind) { // model it!
                            let theItem = {
                                kind,
                                x: cell.x,
                                y: cell.y
                            };
                            this.island.items.push(theItem);
                            // need some way back from the cell?
                            cell['__isle_item'] = theItem;
                        }
                    }
                    // add it to the level...
                    // levelOne.add(block);
                }
            }
        });
    }
}

export { World };