import { BoundsItem } from '../BoundsItem'

export class AreaForRender {
    bounds: BoundsItem
    score: number // 这个分数是在同层级的
    featureValue: any
    aggrValue: number

    constructor(bounds: BoundsItem, score: number, featureValue: any, aggrValue: number) {
        this.bounds = bounds
        this.score = score
        this.featureValue = featureValue
        this.aggrValue = aggrValue
    }

    serialize() {
        return {
            bounds: {
                x: this.bounds.x,
                y: this.bounds.y,
                width: this.bounds.width,
                height: this.bounds.height,
            },
            score: this.score,
            featureValue: this.featureValue,
            aggrValue: this.aggrValue,
        }
    }
}
