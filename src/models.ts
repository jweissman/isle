type Material = 'wood' | 'stone' | 'glass'; // | 'rope'

interface Item {
    name: string
    description: string
    yields: Material
}

//class MapCell {}
//
//class Region {
//    name: string
//    map: Array<Array<MapCell>>
//
//    constructor({ name: string }) {
//        this.name = name;
//    }
//}

// base World model -- every interaction with the world goes through
// this aggregate root -- maybe we should treat these interactions like promises,
// as though they're remote operations? (eventually they may be!!)
export class Isle {
    name: string
    //regions: Array<Region>

    constructor(name='Isla Sorna') {
        this.name = name;

        // this.regions = [
        //     new Region({
        //         name: 'Beach'
        //     }),
        //     new Region({
        //         name: 'Undergrowth'
        //     }),
        //     new Region({
        //         name: 'Overstory'
        //     })
        //     // new ServiceWorkerRegistration(),
        // ]
    }
}