import { BoundsItem } from './BoundsItem'
import { PointItem } from './PointItem'

const boundsContain = BoundsItem.boundsContain, boundsIntersect = BoundsItem.boundsIntersect;

// interface NodePrototype {
//     _maxChildren
// }

interface Node {
    _classConstructor: any
    _bounds: any
    _depth: number
    _maxChildren: number
    _maxDepth: number
}

class Node {
    static TOP_LEFT = 0
    static TOP_RIGHT = 1
    static BOTTOM_LEFT = 2
    static BOTTOM_RIGHT = 3

    _bounds
    children: PointItem[]
    private nodes: Node[]
    private _descendantsNum: number

    constructor(bounds: BoundsItem, depth?: number, maxDepth?: number, maxChildren?) {
        this._bounds = bounds;
        this.children = [];
        this.nodes = [];
        maxChildren && this._maxChildren !== maxChildren && (this._maxChildren = maxChildren);
        maxDepth && this._maxDepth !== maxDepth && (this._maxDepth = maxDepth);
        depth && (this._depth = depth);
    }

    getSubNodes(): Node[] {
        return this.nodes;
    }

    getChildren() {
        return this.children;
    }
    isEmpty() {
        return 0 === this.nodes.length && 0 === this.children.length;
    }


    getDescendants() {
        let descendants: PointItem[] = []
        let stack: Node[] = [this]
        do {
            let node = stack.pop()
            let subNodes = node.getSubNodes()
            if (subNodes.length) {
                stack.push(...subNodes)
            } else {
                descendants.push(...node.getChildren())
            }
        } while (stack.length)
        return descendants
    }

    // 自带缓存的设计，多次调用后速度变快
    getDescendantsNum(noCache?: boolean): number {
        let count = this._descendantsNum
        if (!noCache && count) { return count }

        let subNodes = this.getSubNodes()
        if (subNodes.length) {
            count = 0
            for (let subNode of subNodes) {
                count += subNode.getDescendantsNum(noCache)
            }
        } else {
            count = this.getChildren().length
        }
        this._descendantsNum = count
        return count
    }

    getBounds(): BoundsItem {
        return this._bounds;
    }
    insert(item: PointItem) {
        if (this.nodes.length) {
            var index = this._findIndex(item);
            this.nodes[index].insert(item);
        } else {
            this.children.push(item);
            var len = this.children.length;
            if (this._depth < this._maxDepth && len > this._maxChildren) {
                this.subdivide();
                for (let i = 0; i < len; i++) this.insert(this.children[i]);
                this.children.length = 0;
            }
        }
    }
    retrieve(item) {
        if (this.nodes.length) {
            var index = this._findIndex(item);
            return this.nodes[index].retrieve(item);
        }
        return this.children;
    }
    _findIndex(item) {
        var b = this._bounds, left = !(item.x > b.x + b.width / 2), top = !(item.y > b.y + b.height / 2), index = Node.TOP_LEFT;
        left ? top || (index = Node.BOTTOM_LEFT) : index = top ? Node.TOP_RIGHT : Node.BOTTOM_RIGHT;
        return index;
    }
    findContainerNode(item: BoundsItem) {
        var b = this._bounds, sureContain = !1;
        if (this.nodes.length) {
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
            if (next >= 0) return this.nodes[next].findContainerNode(item);
        }
        return sureContain || boundsIntersect(b, item) ? this : null;
    }
    subdivide() {
        var depth = this._depth + 1, bx = this._bounds.x, by = this._bounds.y, b_w_h = this._bounds.width / 2, b_h_h = this._bounds.height / 2, bx_b_w_h = bx + b_w_h, by_b_h_h = by + b_h_h;
        this.nodes[Node.TOP_LEFT] = new this._classConstructor(new BoundsItem(bx, by, b_w_h, b_h_h), depth, this._maxDepth, this._maxChildren);
        this.nodes[Node.TOP_RIGHT] = new this._classConstructor(new BoundsItem(bx_b_w_h, by, b_w_h, b_h_h), depth, this._maxDepth, this._maxChildren);
        this.nodes[Node.BOTTOM_LEFT] = new this._classConstructor(new BoundsItem(bx, by_b_h_h, b_w_h, b_h_h), depth, this._maxDepth, this._maxChildren);
        this.nodes[Node.BOTTOM_RIGHT] = new this._classConstructor(new BoundsItem(bx_b_w_h, by_b_h_h, b_w_h, b_h_h), depth, this._maxDepth, this._maxChildren);
    }

    clear() {
        this.children.length = 0;
        var i, len = this.nodes.length;
        for (i = 0; i < len; i++) this.nodes[i].clear();
        this.nodes.length = 0;
    }
}

(Node.prototype as any).nodes = null;
Node.prototype._classConstructor = Node;
Node.prototype.children = null;
Node.prototype._bounds = null;
Node.prototype._depth = 0;
Node.prototype._maxChildren = 4;
Node.prototype._maxDepth = 4;

export { Node }