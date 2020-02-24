import { Node, BoundsItem } from '../src'
import * as assert from 'assert'

describe(Node.name, function () {
    it('isEmpty()', function () {
        let root = new Node(BoundsItem.getBoundsItemToExpand(), 1)
        assert.equal(root.isEmpty(), true)
    })
})