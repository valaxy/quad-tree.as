import { SphericalMercator, LngLatPoint, Point } from '../src'
import * as assert from 'assert'

const { getScale, project, unproject } = SphericalMercator

describe('SphericalMercator', function () {


    it(getScale.name, function () {
        assert.equal(getScale(0), 256)
        assert.equal(getScale(1), 512)
        assert.equal(getScale(2), 1024)
        assert.equal(getScale(3), 2048)
        assert.equal(getScale(20), 268435456)
    })

    it(project.name, function () {
        const checkProject = function (input: [number, number], expected: [number, number]) {
            let result = project(new Point(input[0], input[1]))
            assert.equal(result.x, expected[0])
            assert.equal(result.y, expected[1])
        }

        checkProject([40, 60], [0.6981317007977318, 1.316957896924816])
        checkProject([11.2, 23.3], [0.1954768762233649, 0.41835713245892814])
    })

    it(unproject.name, function () {
        const checkUnproject = function (input: [number, number], expected: [number, number]) {
            let result = unproject(new LngLatPoint(input[0], input[1]))
            assert.equal(result.x, expected[0])
            assert.equal(result.y, expected[1])
        }

        checkUnproject([0.6981317007977318, 1.316957896924816], [40, 60])
        checkUnproject([0.1954768762233649, 0.41835713245892814], [11.2, 23.3])
    })
})