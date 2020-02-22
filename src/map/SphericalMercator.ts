import { LngLatPoint } from '../Basic'

type PointResult = [number, number] // TODO

const earthDiameter = 12756274
const deg2rad = Math.PI / 180
const rad2deg = 180 / Math.PI
const quadPI = Math.PI / 4
const maxLat = 85.0511287798
const half2PI = .5 / Math.PI


const scaleCache: { [key: number]: number } = {}

function getScale(level: number) {
    scaleCache[level] || (scaleCache[level] = 256 * Math.pow(2, level))
    return scaleCache[level]
}

function project(lnglat: LngLatPoint): PointResult {
    let lat = Math.max(Math.min(maxLat, lnglat[1]), -maxLat)
    let x = lnglat[0] * deg2rad, y = lat * deg2rad
    y = Math.log(Math.tan(quadPI + y / 2))
    return [x, y]
}

function unproject(point: PointResult): LngLatPoint {
    let lng = point[0] * rad2deg
    let lat = (2 * Math.atan(Math.exp(point[1])) - Math.PI / 2) * rad2deg
    return [parseFloat(lng.toFixed(6)), parseFloat(lat.toFixed(6))]
}

function transform(point: PointResult, scale) {
    scale = scale || 1
    var a = half2PI, b = .5, c = -a, d = .5
    return [scale * (a * point[0] + b), scale * (c * point[1] + d)]
}

function untransform(point, scale): PointResult {
    var a = half2PI, b = .5, c = -a, d = .5;
    return [(point[0] / scale - b) / a, (point[1] / scale - d) / c];
}

function lngLatToPointByScale(lnglat: LngLatPoint, scale: number, round?) {
    let p = transform(project(lnglat), scale);
    if (round) {
        p[0] = Math.round(p[0]);
        p[1] = Math.round(p[1]);
    }
    return p
}

function lngLatToPoint(lnglat: LngLatPoint, level: number, round?) {
    return lngLatToPointByScale(lnglat, getScale(level), round);
}

function pointToLngLat(point: PointResult, level): LngLatPoint {
    var scale = getScale(level), untransformedPoint = untransform(point, scale);
    return unproject(untransformedPoint);
}

function haversineDistance(point1: PointResult, point2: PointResult) {
    var cos = Math.cos, lat1 = point1[1] * deg2rad, lon1 = point1[0] * deg2rad,
        lat2 = point2[1] * deg2rad, lon2 = point2[0] * deg2rad, dLat = lat2 - lat1,
        dLon = lon2 - lon1, a = (1 - cos(dLat) + (1 - cos(dLon)) * cos(lat1) * cos(lat2)) / 2;
    return earthDiameter * Math.asin(Math.sqrt(a));
}

export default {
    haversineDistance,
    getScale,
    lngLatToPointByScale,
    pointToLngLat,
    lngLatToPoint,
}
