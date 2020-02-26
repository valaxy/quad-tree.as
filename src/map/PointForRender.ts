import { XOrY } from "../Basic"
import { mInt32 } from "../Raw"

export class PointForRender {
    x: XOrY
    y: XOrY
    idx: mInt32
    gid: string | null

    constructor(x: XOrY, y: XOrY, idx: mInt32, gid: string | null) {
        this.x = x
        this.y = y
        this.idx = idx
        this.gid = gid
    }

    serialize() {
        return {
            x: this.x,
            y: this.y,
            idx: this.idx,
            gid: this.gid,
        }
    }
}