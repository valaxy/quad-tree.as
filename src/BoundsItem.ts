import { PointItem } from './PointItem'
import { mMaxFloat32 } from './Raw'
import { Point, XOrY } from './Basic'

export class BoundsItem {
    x: XOrY
    y: XOrY
    width: XOrY
    height: XOrY

    constructor(x: XOrY, y: XOrY, width: XOrY, height: XOrY) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    static getBoundsItemToExpand(): BoundsItem {
        return new BoundsItem(mMaxFloat32, mMaxFloat32, -1, -1)
    }

    static boundsContainPoint(b: BoundsItem, p: PointItem): boolean {
        return b.x <= p.x && b.x + b.width >= p.x && b.y <= p.y && b.y + b.height >= p.y
    }

    static boundsContain(b1: BoundsItem, b2: BoundsItem): boolean {
        return b1.x <= b2.x && b1.x + b1.width >= b2.x + b2.width && b1.y <= b2.y && b1.y + b1.height >= b2.y + b2.height
    }

    static boundsIntersect(b1: BoundsItem, b2: BoundsItem): boolean {
        return b1.x <= b2.x + b2.width && b2.x <= b1.x + b1.width && b1.y <= b2.y + b2.height && b2.y <= b1.y + b1.height
    }

    static getCenter(bounds: BoundsItem): Point {
        return new Point(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
    }

    intersectBounds(b: BoundsItem): boolean {
        return BoundsItem.boundsIntersect(this, b)
    }

    containBounds(b: BoundsItem): boolean {
        return BoundsItem.boundsContain(this, b)
    }

    containPoint(p: PointItem): boolean {
        return BoundsItem.boundsContainPoint(this, p)
    }

    clone(): BoundsItem {
        return new BoundsItem(this.x, this.y, this.width, this.height)
    }

    isEmpty(): boolean {
        return this.width < 0
    }

    getMin(): Point {
        return new Point(this.x, this.y)
    }

    getMax(): Point {
        return new Point(this.x + this.width, this.y + this.height)
    }

    expandByPoint(x: XOrY, y: XOrY): void {
        let minX: XOrY, minY: XOrY, maxX: XOrY, maxY: XOrY
        if (this.isEmpty()) {
            minX = maxX = x
            minY = maxY = y
        } else {
            minX = this.x
            minY = this.y
            maxX = this.x + this.width
            maxY = this.y + this.height
            if (x < minX) {
                minX = x
            } else {
                if (x > maxX) {
                    maxX = x
                }
            }
            if (y < minY) {
                minY = y
            } else {
                if (y > maxY) {
                    maxY = y
                }
            }
        }
        this.x = minX
        this.y = minY
        this.width = maxX - minX
        this.height = maxY - minY
    }

    expandByBounds(bounds: BoundsItem): void {
        if (bounds.isEmpty()) { return }

        let minX = this.x,
            minY = this.y,
            maxX = this.x + this.width,
            maxY = this.y + this.height,
            newMinX = bounds.x,
            newMaxX = bounds.x + bounds.width,
            newMinY = bounds.y,
            newMaxY = bounds.y + bounds.height
        if (this.isEmpty()) {
            minX = newMinX
            minY = newMinY
            maxX = newMaxX
            maxY = newMaxY
        } else {
            if (newMinX < minX) { minX = newMinX }
            if (newMaxX > maxX) { maxX = newMaxX }
            if (newMinY < minY) { minY = newMinY }
            if (newMaxY > maxY) { maxY = newMaxY }
        }
        this.x = minX
        this.y = minY
        this.width = maxX - minX
        this.height = maxY - minY
    }

    getTopLeft(): Point {
        return new Point(this.x, this.y)
    }

    getTopRight(): Point {
        return new Point(this.x + this.width, this.y)
    }

    getBottomLeft(): Point {
        return new Point(this.x, this.y + this.height)
    }

    getBottomRight(): Point {
        return new Point(this.x + this.width, this.y + this.height)
    }
}



