import { mUint32, mFloat32 } from './Raw'


// 坐标点
export class Point {
    x: mUint32
    y: mUint32
}

export type LngOrLat = mFloat32           // 经度或纬度
export type LngLatPoint = Array<LngOrLat>


// // 经纬度
// export class LngLatPoint {
//     lng: mFloat32
//     lat: mFloat32

//     constructor(lng: mFloat32, lat: mFloat32) {
//         this.lng = lng
//         this.lat = lat
//     }

//     toArray(): Array<mFloat32> {
//         return [this.lng, this.lat]
//     }
// }