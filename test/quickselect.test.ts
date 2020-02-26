import { quickselect } from '../src/index'
import * as assert from 'assert'

describe(quickselect.name, function () {
    it('selection', function () {
        let arr = [65, 28, 59, 33, 21, 56, 22, 95, 50, 12, 90, 53, 28, 77, 39]
        quickselect(arr, (a, b) => a < b ? -1 : a > b ? 1 : 0, 8)
        assert.deepEqual(arr, [39, 28, 28, 33, 21, 12, 22, 50, 53, 56, 59, 65, 90, 77, 95])
    })
})

