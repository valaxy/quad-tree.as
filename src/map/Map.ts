import { QuadTree } from '../QuadTree'
import { BoundsItem } from '../BoundsItem'
import { PointItemData } from '../PointItemData'
import { PointItem } from '../PointItem'
import { lngLatToPoint } from './SphericalMercator'
import { LngLatPoint, PointPair } from '../Basic'
import { mFloat32, mInt32 } from '../Raw'

export class Map {
    private _quadTree: QuadTree | null = null
    private _list: PointItem[] = []
    private _bounds: BoundsItem = BoundsItem.getBoundsItemToExpand()

    private _badBoundsAspectRatio: mFloat32
    private _maxZoom: mInt32
    private _maxChildrenOfQuadNode: mInt32
    private _maxDepthOfQuadTree: mInt32

    get quadTree(): QuadTree | null {
        return this._quadTree
    }

    constructor(badBoundsAspectRatio: mFloat32, maxZoom: mInt32, maxChildrenOfQuadNode: mInt32, maxDepthOfQuadTree: mInt32) {
        this._badBoundsAspectRatio = badBoundsAspectRatio
        this._maxZoom = maxZoom
        this._maxChildrenOfQuadNode = maxChildrenOfQuadNode
        this._maxDepthOfQuadTree = maxDepthOfQuadTree

        // console.log(this._badBoundsAspectRatio, this._maxZoom, this._maxChildrenOfQuadNode, this._maxDepthOfQuadTree)
    }


    buildQuadTree(data: PointItemData[]): void {
        this._clearData()
        this.trigger("willBuildData")
        this._buildDataItems(data)
        this._buildQuadTree()
        this.trigger("didBuildData")
    }


    private _buildDataItems(data: PointItemData[]): void {
        let bounds = BoundsItem.getBoundsItemToExpand()
        for (let list = this._list, idx = 0, len = data.length; idx < len; idx++) {
            let point = data[idx]
            let pos = point.pos
            if (!pos) { throw new Error('getPosition should not return null') }
            let px = this._getPixelOfMaxZoom(pos)
            let item = new PointItem(px[0], px[1], idx, point) // 将业务数据挂载到PointItem上方便四叉树节点的聚合
            list[idx] = item
            bounds.expandByPoint(px[0], px[1])
        }
        this._bounds = bounds
    }

    private _buildQuadTree(): void {
        if (this._quadTree) {
            this._quadTree.clear()
            this._quadTree = null
        }
        this.trigger("willBuildQuadTree")
        var bounds = this._bounds
            , items = this._list
            , quadBounds = this._adjustRootBounds(bounds);
        QuadTree.setMaxChildrenAndDepth(this._maxChildrenOfQuadNode, this._maxDepthOfQuadTree);
        let quadTree = new QuadTree(quadBounds, this._maxDepthOfQuadTree, this._maxChildrenOfQuadNode)
        let root = quadTree.root
        for (let i = 0, len = items.length; i < len; i++) {
            root.insert(items[i]);
        }
        this._quadTree = quadTree;
        this.trigger("didBuildQuadTree")
    }


    private _adjustRootBounds(bounds: BoundsItem): BoundsItem {
        var width = bounds.width
            , height = bounds.height
            , aspectRatio = width / height
            , badAspectRatio = this._badBoundsAspectRatio;
        if (badAspectRatio) {
            if (badAspectRatio > 1) {
                badAspectRatio = 1 / badAspectRatio
            }
            if (aspectRatio > 1 / badAspectRatio) {
                var newHeight = Math.ceil(width * badAspectRatio);
                bounds.y -= Math.floor((newHeight - bounds.height) / 2);
                bounds.height = newHeight;
            } else if (aspectRatio < badAspectRatio / 1) {
                var newWidth = Math.ceil(height * badAspectRatio);
                bounds.x -= Math.floor((newWidth - bounds.width) / 2);
                bounds.width = newWidth;
            }
        }
        var x = bounds.x
            , y = bounds.y
            , w = bounds.width
            , h = bounds.height
            , r = x + w
            , b = y + h
            , factor = 256;
        bounds.x = Math.floor(x / factor) * factor;
        bounds.y = Math.floor(y / factor) * factor;
        bounds.width = Math.ceil(r / factor) * factor - bounds.x;
        bounds.height = Math.ceil(b / factor) * factor - bounds.y;
        return bounds;
    }


    private _getPixelOfMaxZoom(lngLat: LngLatPoint): PointPair {
        let maxZoom = this._maxZoom
        let pMx = lngLatToPoint(lngLat, maxZoom)
        return [Math.round(pMx[0]), Math.round(pMx[1])]
    }

    private _clearData(): void {
        this.trigger("willClearData")
        this._list = []
        this._bounds = BoundsItem.getBoundsItemToExpand()
        this.trigger("didClearData")
    }


    private trigger(event: string): void { }
}