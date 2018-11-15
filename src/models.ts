type Material = 'wood' | 'stone' | 'glass'; // | 'rope'

interface ItemKind {
    name: string
    description: string
    destructible: boolean
    yields?: Material
    openable: boolean
    // open?: boolean
}

interface Item {
    kind: ItemKind
    x: number
    y: number
    // open?: boolean
    // ...
}

class Isle {
    constructor(public name: string, public items: Array<Item> = []) {
    }
}

export { Isle, Item, ItemKind };