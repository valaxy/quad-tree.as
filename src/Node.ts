import { BoundsItem } from './BoundsItem'
import { PointItem } from './PointItem'
import { mUint32, mUint8 } from './Raw'

const boundsContain = BoundsItem.boundsContain, boundsIntersect = BoundsItem.boundsIntersect;

// interface NodePrototype {
//     _maxChildren
// }

let maxDepth: mUint32 = 4
let maxChildren: mUint32 = 4

export function setupNode(_maxDepth: mUint32, _maxChildren: mUint32) {
    maxDepth = _maxDepth
    maxChildren = _maxChildren
}

class Node {
    static TOP_LEFT = 0
    static TOP_RIGHT = 1
    static BOTTOM_LEFT = 2
    static BOTTOM_RIGHT = 3

    private _bounds: BoundsItem
    private _depth: mUint8
    private _subNodes: Node[] = []
    private _children: PointItem[] = []

    private _descendantsNum: mUint32 // 会缓存？

    get bounds(): BoundsItem { return this._bounds }

    get depth(): mUint8 { return this._depth }

    get subNodes(): Node[] { return this._subNodes }

    get children(): PointItem[] { return this._children }


    constructor(bounds: BoundsItem, depth: number) {
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
    getDescendantsNum(noCache: boolean = false): mUint32 {
        let count: mUint32 = this._descendantsNum
        if (!noCache && count) { return count }

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
            var len = this._children.length;
            if (this._depth < maxDepth && len > maxChildren) {
                this.subdivide();
                for (let i = 0; i < len; i++) this.insert(this._children[i]);
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

    private _findIndex(item: PointItem): mUint32 {
        var b = this._bounds, left = !(item.x > b.x + b.width / 2), top = !(item.y > b.y + b.height / 2), index = Node.TOP_LEFT;
        left ? top || (index = Node.BOTTOM_LEFT) : index = top ? Node.TOP_RIGHT : Node.BOTTOM_RIGHT;
        return index
    }

    findContainerNode(item: BoundsItem): Node | null {
        var b = this._bounds, sureContain = false
        if (this._subNodes.length) {
            var halfW = b.width / 2, halfH = b.height / 2, next = -1;
            if (boundsContain(b, item)) {
                sureContain = !0;
                boundsContain({
                    x: b.x,
                    y: b.y,
                    width: halfW,
                    height: halfH
                } as any, item) ? next = Node.TOP_LEFT : boundsContain({ // TODO 优化ts类型
                    x: b.x + halfW,
                    y: b.y,
                    width: halfW,
                    height: halfH
                } as any, item) ? next = Node.TOP_RIGHT : boundsContain({
                    x: b.x,
                    y: b.y + halfH,
                    width: halfW,
                    height: halfH
                } as any, item) ? next = Node.BOTTOM_LEFT : boundsContain({
                    x: b.x + halfW,
                    y: b.y + halfH,
                    width: halfW,
                    height: halfH
                } as any, item) && (next = Node.BOTTOM_RIGHT);
            }
            if (next >= 0) return this._subNodes[next].findContainerNode(item);
        }
        return sureContain || boundsIntersect(b, item) ? this : null
    }

    subdivide(): void {
        var depth = this._depth + 1, bx = this._bounds.x, by = this._bounds.y, b_w_h = this._bounds.width / 2, b_h_h = this._bounds.height / 2, bx_b_w_h = bx + b_w_h, by_b_h_h = by + b_h_h;
        this._subNodes[Node.TOP_LEFT] = new Node(new BoundsItem(bx, by, b_w_h, b_h_h), depth)
        this._subNodes[Node.TOP_RIGHT] = new Node(new BoundsItem(bx_b_w_h, by, b_w_h, b_h_h), depth)
        this._subNodes[Node.BOTTOM_LEFT] = new Node(new BoundsItem(bx, by_b_h_h, b_w_h, b_h_h), depth)
        this._subNodes[Node.BOTTOM_RIGHT] = new Node(new BoundsItem(bx_b_w_h, by_b_h_h, b_w_h, b_h_h), depth)
    }

    clear(): void {
        this._children.length = 0;
        var i, len = this._subNodes.length;
        for (i = 0; i < len; i++) this._subNodes[i].clear();
        this._subNodes.length = 0;
    }
}


export { Node }