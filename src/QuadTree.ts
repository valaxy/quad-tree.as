import { Node, setupNode } from './Node'
import { PointItem } from './PointItem'
import { mUint32 } from './Raw'
import { BoundsItem } from './BoundsItem'

export class QuadTree {
    private _root: Node

    get root(): Node { return this._root }

    static setMaxChildrenAndDepth(maxChildren: mUint32, maxDepth: mUint32): void {
        setupNode(maxDepth, maxChildren)
    }

    constructor(bounds: BoundsItem, maxDepth: mUint32, maxChildren: mUint32) {
        setupNode(maxDepth, maxChildren)
        this._root = new Node(bounds, 0)
    }

    insert(items: PointItem[]): void {
        for (let i = 0, len = items.length; i < len; i++) {
            this._root.insert(items[i])
        }
    }

    clear(): void {
        this._root.clear()
    }

    findContainerNode(item: BoundsItem): Node | null {
        return this._root.findContainerNode(item)
    }

}


    // retrieve(item: PointItem): PointItem[] {
    //     let out = this._root.retrieve(item).slice(0)
    //     return out
    // }