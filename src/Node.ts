import { BoundsItem } from './BoundsItem'
import { PointItem } from './PointItem'
import { mUint32, mUint8, mInt32 } from './Raw'

const boundsContain = BoundsItem.boundsContain, boundsIntersect = BoundsItem.boundsIntersect;

// interface NodePrototype {
//     _maxChildren
// }

let maxDepth: mUint32 = 4
let maxChildren: mUint32 = 4

export function setupNode(_maxDepth: mUint32, _maxChildren: mUint32): void {
    maxDepth = _maxDepth
    maxChildren = _maxChildren
}

class Node {
    static TOP_LEFT: mUint8 = 0
    static TOP_RIGHT: mUint8 = 1
    static BOTTOM_LEFT: mUint8 = 2
    static BOTTOM_RIGHT: mUint8 = 3

    private _bounds: BoundsItem
    private _depth: mUint8
    private _subNodes: Node[] = []
    private _children: PointItem[] = []

    private _descendantsNum: mInt32 = -1 // 会缓存？

    get bounds(): BoundsItem { return this._bounds }

    get depth(): mUint8 { return this._depth }

    get subNodes(): Node[] { return this._subNodes }

    get children(): PointItem[] { return this._children }


    constructor(bounds: BoundsItem, depth: mUint8) {
        this._bounds = bounds
        this._depth = depth
    }

    isEmpty(): boolean {
        return 0 === this._subNodes.length && 0 === this._children.length
    }

    getDescendants(): PointItem[] {
        let descendants: PointItem[] = []
        let stack: Node[] = [this]
        do {
            let node = stack.pop()
            let subNodes = node.subNodes
            if (subNodes.length) {
                for (let i = 0; i < subNodes.length; i++) {
                    stack.push(subNodes[i])
                }
            } else {
                let children = node.children
                for (let i = 0; i < children.length; i++) {
                    descendants.push(children[i])
                }
            }
        } while (stack.length)
        return descendants
    }

    // 自带缓存的设计，多次调用后速度变快
    // 默认缓存
    getDescendantsNum(noCache: boolean = false): mInt32 {
        let count = this._descendantsNum
        if (!noCache && count != -1) { return count }

        let subNodes = this.subNodes
        if (subNodes.length) {
            count = 0
            for (let i = 0; i < subNodes.length; i++) {
                let subNode = subNodes[i]
                count += subNode.getDescendantsNum(noCache)
            }
        } else {
            count = this.children.length
        }
        this._descendantsNum = count
        return count
    }

    insert(item: PointItem): void {
        if (this._subNodes.length) {
            var index = this._findIndex(item);
            this._subNodes[index].insert(item);
        } else {
            this._children.push(item);
            let len: mUint32 = this._children.length
            if (this._depth < maxDepth && len > maxChildren) {
                this.subdivide();
                for (let i: mUint32 = 0; i < len; i++) {
                    this.insert(this._children[i])
                }
                this._children.length = 0
            }
        }
    }

    retrieve(item: PointItem): PointItem[] {
        if (this._subNodes.length) {
            let index = this._findIndex(item)
            return this._subNodes[index].retrieve(item);
        }
        return this._children;
    }

    private _findIndex(item: PointItem): mInt32 {
        var b = this._bounds, left = !(item.x > b.x + b.width / 2)
        let top = !(item.y > b.y + b.height / 2)
        let index = Node.TOP_LEFT
        if (left) {
            if (!top) {
                index = Node.BOTTOM_LEFT
            }
        } else {
            index = top ? Node.TOP_RIGHT : Node.BOTTOM_RIGHT
        }
        return index
    }

    findContainerNode(item: BoundsItem): Node | null {
        let b = this._bounds, sureContain = false
        if (this._subNodes.length) {
            var halfW = b.width / 2, halfH = b.height / 2
            let next = -1
            if (boundsContain(b, item)) {
                sureContain = true
                let neverUse = boundsContain(new BoundsItem(
                    b.x,
                    b.y,
                    halfW,
                    halfH
                ), item) ? next = Node.TOP_LEFT : boundsContain(new BoundsItem(
                    b.x + halfW,
                    b.y,
                    halfW,
                    halfH
                ), item) ? next = Node.TOP_RIGHT : boundsContain(new BoundsItem(
                    b.x,
                    b.y + halfH,
                    halfW,
                    halfH
                ), item) ? next = Node.BOTTOM_LEFT : boundsContain(new BoundsItem(
                    b.x + halfW,
                    b.y + halfH,
                    halfW,
                    halfH
                ), item) && (next = Node.BOTTOM_RIGHT) > 0
            }
            if (next >= 0) return this._subNodes[next].findContainerNode(item);
        }
        return sureContain || boundsIntersect(b, item) ? this : null
    }

    subdivide(): void {
        let depth = this._depth + 1
        let bx = this._bounds.x
        let by = this._bounds.y
        let b_w_h = this._bounds.width / 2
        let b_h_h = this._bounds.height / 2
        let bx_b_w_h = bx + b_w_h
        let by_b_h_h = by + b_h_h
        this._subNodes[Node.TOP_LEFT] = new Node(new BoundsItem(bx, by, b_w_h, b_h_h), depth)
        this._subNodes[Node.TOP_RIGHT] = new Node(new BoundsItem(bx_b_w_h, by, b_w_h, b_h_h), depth)
        this._subNodes[Node.BOTTOM_LEFT] = new Node(new BoundsItem(bx, by_b_h_h, b_w_h, b_h_h), depth)
        this._subNodes[Node.BOTTOM_RIGHT] = new Node(new BoundsItem(bx_b_w_h, by_b_h_h, b_w_h, b_h_h), depth)
    }

    clear(): void {
        this._children.length = 0
        for (let i = 0, len = this._subNodes.length; i < len; i++) {
            this._subNodes[i].clear()
        }
        this._subNodes.length = 0
    }
}


export { Node }