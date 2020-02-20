import { Node } from './Node'
import { PointItem } from './PointItem'

export class QuadTree {
    static Node = Node

    root: Node

    constructor(bounds, pointQuad, maxDepth, maxChildren) {
        this.root = new Node(bounds, 0, maxDepth, maxChildren)
    }

    insert(item: PointItem | PointItem[]) {
        if (item instanceof Array) {
            for (let i = 0, len = item.length; i < len; i++) {
                this.root.insert(item[i])
            }
        } else {
            this.root.insert(item)
        }
    }

    clear() {
        this.root.clear();
    }
    findContainerNode(item) {
        return this.root.findContainerNode(item);
    }
    retrieve(item) {
        var out = this.root.retrieve(item).slice(0);
        return out;
    }

    static setMaxChildrenAndDepth(maxChildren, maxDepth) {
        Node.prototype._maxChildren = maxChildren;
        Node.prototype._maxDepth = maxDepth;
    }
}


QuadTree.prototype.root = null;
