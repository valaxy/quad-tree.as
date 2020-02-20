import { Node, setupNode } from './Node'
import { PointItem } from './PointItem'
import { mUint32 } from './Raw'
import { BoundsItem } from './BoundsItem'

export class QuadTree {
    static Node = Node

    root: Node

    static setMaxChildrenAndDepth(maxChildren: mUint32, maxDepth: mUint32): void {
        setupNode(maxDepth, maxChildren)
    }

    constructor(bounds: BoundsItem, maxDepth: mUint32, maxChildren: mUint32) {
        setupNode(maxDepth, maxChildren)
        this.root = new Node(bounds, 0)
    }

    insert(item: PointItem | PointItem[]): void {
        if (item instanceof Array) {
            for (let i = 0, len = item.length; i < len; i++) {
                this.root.insert(item[i])
            }
        } else {
            this.root.insert(item)
        }
    }

    clear(): void {
        this.root.clear()
    }

    findContainerNode(item: BoundsItem): Node | null {
        return this.root.findContainerNode(item)
    }

    retrieve(item: PointItem): PointItem[] {
        let out = this.root.retrieve(item).slice(0)
        return out
    }
}


QuadTree.prototype.root = null;
