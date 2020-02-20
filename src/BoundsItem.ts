import { PointItem } from './PointItem'
import { mUint32, mMaxUint32 } from './Raw'
import { Point } from './Basic'

export class BoundsItem {
    x: mUint32
    y: mUint32
    width: mUint32
    height: mUint32

    constructor(x: mUint32, y: mUint32, width: mUint32, height: mUint32) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    static getBoundsItemToExpand(): BoundsItem {
        return new BoundsItem(mMaxUint32, mMaxUint32, -1, -1)
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
        return {
            x: bounds.x + bounds.width / 2,
            y: bounds.y + bounds.height / 2,
        }
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
        return {
            x: this.x,
            y: this.y
        }
    }

    getMax(): Point {
        return {
            x: this.x + this.width,
            y: this.y + this.height
        };
    }

    expandByPoint(x: mUint32, y: mUint32): void {
        let minX: mUint32, minY: mUint32, maxX: mUint32, maxY: mUint32
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
        return {
            x: this.x,
            y: this.y
        }
    }

    getTopRight(): Point {
        return {
            x: this.x + this.width,
            y: this.y
        }
    }

    getBottomLeft(): Point {
        return {
            x: this.x,
            y: this.y + this.height
        }
    }

    getBottomRight(): Point {
        return {
            x: this.x + this.width,
            y: this.y + this.height
        }
    }


}



