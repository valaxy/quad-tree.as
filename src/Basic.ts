import { mUint32, mFloat32, mFloat64 } from './Raw'


// 像素坐标点
export type XOrY = mFloat64
export class Point {
    x: XOrY
    y: XOrY

    constructor(x: XOrY, y: XOrY) {
        this.x = x
        this.y = y
    }
}


// 经度或纬度
export type LngOrLat = mFloat64
export class LngLatPoint {
    mapX: LngOrLat
    mapY: LngOrLat

    constructor(mapX: LngOrLat, mapY: LngOrLat) {
        this.mapX = mapX
        this.mapY = mapY
    }
}