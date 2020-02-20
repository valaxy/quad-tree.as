import { PointItemData } from './PointItemData'
import { mUint32 } from './Raw'

/**
 * 像素点
 */
export class PointItem {
    x: mUint32 // 像素单位
    y: mUint32 // 像素单位
    idx: mUint32 // 数据索引
    data: PointItemData

    constructor(x: mUint32, y: mUint32, idx: mUint32, data: PointItemData) {
        this.x = x
        this.y = y
        this.idx = idx
        this.data = data
    }
}


