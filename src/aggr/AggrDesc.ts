import { mFloat32 } from "../Raw"

export class MapPoint {
    mapX: mFloat32
    mapY: mFloat32

    constructor(mapX: mFloat32, mapY: mFloat32) {
        this.mapX = mapX
        this.mapY = mapY
    }
}

export class AggrRoot {
    points: MapPoint[]
}

export class AggrDesc {
    data: mFloat32[] // TODO 需要支持整数
    groupFunc: string // 'max' | 'min' | 'sum' | 'count'
}