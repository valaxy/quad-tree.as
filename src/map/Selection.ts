import { BoundsItem } from '../BoundsItem'
import { Node } from '../Node'
import { quickselect } from './quickselect'
import { PointItem } from '../PointItem'
import { mInt32 } from '../Raw'

// @ts-ignore
@external('aa', 'bb')
declare function dd(): void

// @ts-ignore
@external('bb', 'cc')
declare function abc(): void



/**
 * 对地图的一次节点筛选
 */
export class Selection {
    constructor() {
        console.log(123123, dd)
    }

    _getAreaBounds(nodeBounds: BoundsItem, viewBounds: BoundsItem, scaleFactor: number): BoundsItem {
        return new BoundsItem(
            (nodeBounds.x - viewBounds.x) / scaleFactor,
            (nodeBounds.y - viewBounds.y) / scaleFactor,
            nodeBounds.width / scaleFactor,
            nodeBounds.height / scaleFactor
        )
    }

    _compare(a: mInt32, b: mInt32): mInt32 {
        return a < b ? -1 : a > b ? 1 : 0
    }

    // 200ms
    _getTopDescendants(node: Node, selectNum: number): PointItem[] {
        let descendants = node.getDescendants()
        let len = descendants.length
        if (len > selectNum) {
            quickselect(descendants.map(pointItem => pointItem.idx), this._compare.bind(this), selectNum)
            descendants.length = selectNum
        }
        return descendants
    }
}