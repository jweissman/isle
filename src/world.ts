import * as ex from 'excalibur';
import TiledResource from '@excaliburjs/excalibur-tiled';

// hmmmm (maybe more like a world-factory?)
class World {
    tileMap: ex.TileMap
    blockingActors: Array<ex.Actor>

    constructor(public mapResource: TiledResource, public debugBoxes: boolean) {
        this._processTiledMap();
    }

    entityAt(x: number, y: number) {
        return { nothing: 'to see here' };
         //let cell = this._map.getCellByPoint(interactionPos.x, interactionPos.y);
    //console.log(
    //  "WOULD ATTEMPT TO INTERACT IN DIRECTION w/ CELL: ", 
    //  { dir: this.facing, cell }
    //);
    //if (cell.sprites.length > 1) {
    //  console.log("goodness, there is something there!!!", cell.sprites);
    //  // we need to build some kind of object model we can deref
    //  // all we'll have is a spriteId...
    //}

    }

    _processTiledMap() {
        let _mapRes = this.mapResource; // Resources.Map;
        let terrainMeta = {};
        let spriteTerrainById = {};
        let spriteCollisionById = {};

        _mapRes.data.tilesets.forEach((ts) => {
            console.log("TILESET", { ts });
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
                    const solid = terrain.some(tile => terrainMeta[tile] && terrainMeta[tile].solid); // : false);
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

                // console.log({ spriteCollisionById });

            }
        });

        this.tileMap = _mapRes.getTileMap();

        this.blockingActors = [];

        this.tileMap.data.forEach((cell: ex.Cell) => {

            if (cell.sprites[0]) {
                let tile = spriteTerrainById[cell.sprites[0].spriteId];
                cell = Object.assign(cell, tile);

                // we have another sprite, maybe a thing to build a box for?
                if (cell.sprites[1]) {
                    const collision = spriteCollisionById[cell.sprites[1].spriteId];
                    if (collision) {
                        let block = new ex.Actor(cell.x, cell.y, 32, 32);
                        block.collisionType = ex.CollisionType.Fixed;

                        if (collision.ellipse) {
                            block.body.useCircleCollision(
                                collision.height / 2, // / 1.2,
                                new ex.Vector(collision.x, collision.y)
                            );
                        } else if (collision.polygon) {
                            //console.log("poly", { polygon: collision.polygon });
                            //debugger;
                            let vecs : ex.Vector[] = collision.polygon.map(
                                ({ x, y }) => new ex.Vector(collision.x + x, collision.y + y)
                            );

                            block.body.usePolygonCollision(
                                vecs
                            )
                        } else {
                            console.warn("implement collider:", { collision })
                            //debugger;
                        }
                        if (this.debugBoxes) { // config.debugBoundingBoxes) {
                            console.log({ collision, block });
                            block.draw = (ctx) => {
                                block.collisionArea.debugDraw(ctx, ex.Color.LightGray);
                            }
                        }
                        //console.log({collision});
                        this.blockingActors.push(block);
                    }
                    // add it to the level...
                    // levelOne.add(block);
                }
            }
        });
    }
}

export { World };