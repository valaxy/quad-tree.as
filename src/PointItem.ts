import { PointItemData } from './PointItemData'

export class PointItem {
    x: number
    y: number
    idx: number
    data: PointItemData

    constructor(x, y, idx, data: PointItemData) {
        this.x = x
        this.y = y
        this.idx = idx
        this.data = data
    }
}
