import { QuadTree } from '../QuadTree'
import { BoundsItem } from '../BoundsItem'
import { PointItemData } from '../PointItemData'
import SphericalMercator from './SphericalMercator'

export class Map {
    private _quadTree: QuadTree

    // private _buildDataItems(data: PointItemData[]) {
    //     let bounds = BoundsItem.getBoundsItemToExpand()
    //     for (var list = this._data.list, idx = 0, len = data.length; idx < len; idx++) {
    //         let point = data[idx]
    //         let pos: LngLat = point.pos as LngLat
    //         if (!pos) { throw new Error('post should not null') }

    //         let px = this._getPixelOfMaxZoom(pos)
    //         let item = new PointItem(px[0], px[1], idx, point) // 将业务数据挂载到PointItem上方便四叉树节点的聚合
    //         list[idx] = item
    //         bounds.expandByPoint(px[0], px[1])
    //     }
    //     this._data.bounds = bounds
    // }

    // private _buildQuadTree() {
    //     if (this._quadTree) {
    //         this._quadTree.clear();
    //         this._quadTree = null;
    //     }
    //     this.trigger("willBuildQuadTree");
    //     var bounds = this._data.bounds
    //         , opts = this._opts
    //         , items = this._data.list
    //         , quadBounds = this._adjustRootBounds(bounds);
    //     QuadTree.setMaxChildrenAndDepth(opts.maxChildrenOfQuadNode, opts.maxDepthOfQuadTree);
    //     let quadTree = new QuadTree(quadBounds, opts.maxDepthOfQuadTree, opts.maxChildrenOfQuadNode)
    //     for (let root = quadTree.root, i = 0, len = items.length; i < len; i++) {
    //         root.insert(items[i]);
    //     }
    //     this._quadTree = quadTree;
    //     this.trigger("didBuildQuadTree", quadTree);
    // }

    // private _adjustRootBounds(bounds) {
    //     var width = bounds.width
    //         , height = bounds.height
    //         , aspectRatio = width / height
    //         , badAspectRatio = this._opts.badBoundsAspectRatio;
    //     if (badAspectRatio) {
    //         badAspectRatio > 1 && (badAspectRatio = 1 / badAspectRatio);
    //         if (aspectRatio > 1 / badAspectRatio) {
    //             var newHeight = Math.ceil(width * badAspectRatio);
    //             bounds.y -= Math.floor((newHeight - bounds.height) / 2);
    //             bounds.height = newHeight;
    //         } else if (aspectRatio < badAspectRatio / 1) {
    //             var newWidth = Math.ceil(height * badAspectRatio);
    //             bounds.x -= Math.floor((newWidth - bounds.width) / 2);
    //             bounds.width = newWidth;
    //         }
    //     }
    //     var x = bounds.x
    //         , y = bounds.y
    //         , w = bounds.width
    //         , h = bounds.height
    //         , r = x + w
    //         , b = y + h
    //         , factor = 256;
    //     bounds.x = Math.floor(x / factor) * factor;
    //     bounds.y = Math.floor(y / factor) * factor;
    //     bounds.width = Math.ceil(r / factor) * factor - bounds.x;
    //     bounds.height = Math.ceil(b / factor) * factor - bounds.y;
    //     return bounds;
    // }


    // private _getPixelOfMaxZoom(lngLat: LngLat): Point {
    //     let maxZoom = this.getMaxZoom()
    //     let pMx = SphericalMercator.lngLatToPoint(lngLat, maxZoom)
    //     return [Math.round(pMx[0]), Math.round(pMx[1])]
    // }

    // getMaxZoom() {
    //     return this._opts.zooms[1]
    // }


    // private trigger(event: string): void {

    // }
}