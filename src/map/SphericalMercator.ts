import { Point, LngLatPoint } from '../Basic'
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
    scales[0] = 256
    for (let level = 1; level < MAX_LEVEL; level++) {
        scales[level] = 2 * scales[level - 1]
    }
}

_initScale()

function getScale(level: mInt32): mInt32 {
    return scales[level]
}

function project(lnglat: LngLatPoint): Point {
    let lat = Math.max(Math.min(maxLat, lnglat.mapY), -maxLat)
    let x = lnglat.mapX * deg2rad, y = lat * deg2rad
    y = Math.log(Math.tan(quadPI + y / 2))
    return new Point(x, y)
}

function toFixed6(n: mFloat64): mFloat64 {
    return Math.round(n * 1000000) / 1000000
}

function unproject(point: Point): LngLatPoint {
    let lng = point.x * rad2deg
    let lat = (2 * Math.atan(Math.exp(point.y)) - Math.PI / 2) * rad2deg
    return new LngLatPoint(toFixed6(lng), toFixed6(lat))
}



function transform(point: Point, scale: mInt32): Point {
    var a = half2PI, b = .5, c = -a, d = .5
    return new Point(scale * (a * point.x + b), scale * (c * point.y + d))
}

function untransform(point: Point, scale: mInt32): Point {
    var a = half2PI, b = .5, c = -a, d = .5;
    return new Point((point.x / scale - b) / a, (point.y / scale - d) / c)
}



function lngLatToPoint(lnglat: LngLatPoint, level: mInt32): Point {
    let scale = getScale(level)
    let p = transform(project(lnglat), scale)
    return p
}

function pointToLngLat(point: Point, level: mInt32): LngLatPoint {
    var scale = getScale(level), untransformedPoint = untransform(point, scale);
    return unproject(untransformedPoint);
}



function haversineDistance(point1: Point, point2: Point): mFloat64 {
    let lat1 = point1.y * deg2rad, lon1 = point1.x * deg2rad,
        lat2 = point2.y * deg2rad, lon2 = point2.x * deg2rad, dLat = lat2 - lat1,
        dLon = lon2 - lon1, a = (1 - Math.cos(dLat) + (1 - Math.cos(dLon)) * Math.cos(lat1) * Math.cos(lat2)) / 2;
    return earthDiameter * Math.asin(Math.sqrt(a));
}

export {
    haversineDistance,
    getScale,
    pointToLngLat,
    lngLatToPoint,
}
