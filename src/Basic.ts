import { mUint32, mFloat32, mFloat64 } from './Raw'


// 坐标点
export type XOrY = mFloat64
export class Point {
    x: XOrY
    y: XOrY

    constructor(x: XOrY, y: XOrY) {
        this.x = x
        this.y = y
    }
}
export type PointPair = Array<XOrY>


// 经度或纬度
export type LngOrLat = mFloat64
export type LngLatPoint = Array<LngOrLat>



// // 像素坐标点
// export class Point {
//     x: mFloat32
//     y: mFloat32

//     constructor(x: mFloat32, y: mFloat32) {
//         this.x = x
//         this.y = y
//     }
// }


// // 经纬度
// export class LngLatPoint {
//     x: mFloat32
//     y: mFloat32

//     constructor(x: mFloat32, y: mFloat32) {
//         this.x = x
//         this.y = y
//     }
// }