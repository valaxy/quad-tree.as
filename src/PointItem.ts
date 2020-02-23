import { PointItemData } from './PointItemData'
import { XOrY } from './Basic'

/**
 * 像素点
 */
export class PointItem {
    x: XOrY // 像素单位
    y: XOrY // 像素单位
    idx: XOrY // 数据索引
    data: PointItemData

    constructor(x: XOrY, y: XOrY, idx: XOrY, data: PointItemData) {
        this.x = x
        this.y = y
        this.idx = idx
        this.data = data
    }
}


