import { LngLatPoint, PointPair } from '../Basic'
import { mInt32, mFloat64 } from '../Raw'

const earthDiameter: mFloat64 = 12756274
const deg2rad = Math.PI / 180
const rad2deg = 180 / Math.PI
const quadPI = Math.PI / 4
const maxLat = 85.0511287798
const half2PI = .5 / Math.PI

const MAX_LEVEL = 32
const scales: mInt32[] = new Array(MAX_LEVEL)

function _initScale(): void {
    for (let level = 0; level < MAX_LEVEL; level++) {
        scales[level] = 256 * Math.pow(2, level) as mInt32 // TODO
    }
}

_initScale()

function getScale(level: mInt32): mInt32 {
    return scales[level]
}

function project(lnglat: LngLatPoint): PointPair {
    let lat = Math.max(Math.min(maxLat, lnglat[1]), -maxLat)
    let x = lnglat[0] * deg2rad, y = lat * deg2rad
    y = Math.log(Math.tan(quadPI + y / 2))
    return [x, y]
}

function toFixed6(n: mFloat64): mFloat64 {
    return Math.round(n * 1000000) / 1000000
}

function unproject(point: PointPair): LngLatPoint {
    let lng = point[0] * rad2deg
    let lat = (2 * Math.atan(Math.exp(point[1])) - Math.PI / 2) * rad2deg
    return [toFixed6(lng), toFixed6(lat)]
}



function transform(point: PointPair, scale: mInt32): PointPair {
    var a = half2PI, b = .5, c = -a, d = .5
    return [scale * (a * point[0] + b), scale * (c * point[1] + d)]
}

function untransform(point: PointPair, scale: mInt32): PointPair {
    var a = half2PI, b = .5, c = -a, d = .5;
    return [(point[0] / scale - b) / a, (point[1] / scale - d) / c];
}



function lngLatToPoint(lnglat: LngLatPoint, level: mInt32): PointPair {
    let scale = getScale(level)
    let p = transform(project(lnglat), scale)
    return p
}

function pointToLngLat(point: PointPair, level: mInt32): LngLatPoint {
    var scale = getScale(level), untransformedPoint = untransform(point, scale);
    return unproject(untransformedPoint);
}



function haversineDistance(point1: PointPair, point2: PointPair): mFloat64 {
    let lat1 = point1[1] * deg2rad, lon1 = point1[0] * deg2rad,
        lat2 = point2[1] * deg2rad, lon2 = point2[0] * deg2rad, dLat = lat2 - lat1,
        dLon = lon2 - lon1, a = (1 - Math.cos(dLat) + (1 - Math.cos(dLon)) * Math.cos(lat1) * Math.cos(lat2)) / 2;
    return earthDiameter * Math.asin(Math.sqrt(a));
}

export {
    haversineDistance,
    getScale,
    pointToLngLat,
    lngLatToPoint,
}
