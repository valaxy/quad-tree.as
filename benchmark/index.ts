import { Map as Map2 } from '../src'
import Benchmark = require('benchmark')
const fs = require("fs")
const path = require('path')
const loader = require("@assemblyscript/loader")
const myImports = {}
const myModule = loader.instantiateSync(
    fs.readFileSync(path.join(__dirname, "../dist/production.wasm")),
    myImports
)

const data = require('./data.json')

const { Map: Map1, __allocArray, __retain, UINT32_ARRAY } = myModule
console.log(myModule)

let list = data.data.filter((item: any) => item.mapX && item.mapY)
console.log(list.length)

const runBenchmark = function () {
    const suite = new Benchmark.Suite('xx', {
        minSamples: 40
    })

    let data: any[] = []
    list.forEach((item: any, i: number) => data.push(item.mapX, item.mapY))
    let dataRef = __retain(__allocArray(UINT32_ARRAY, data))

    suite
        .add('QuadTree as version', function () {
            let start = +new Date()
            let map = new Map1(0.8, 17, 4, 16)
            map.buildQuadTree(dataRef)
            // console.log('as', map.getDescendantsNum(), +new Date() - start)
        })
        .add('QuadTree ts version', function () {
            let start = +new Date()
            let map = new Map2(0.8, 17, 4, 16)
            map.buildQuadTree(data)
            // console.log('ts', map.getDescendantsNum(), +new Date() - start)
        })
        .on('cycle', function (event: any) {
            console.log(String(event.target));
        })
        .on('complete', function (this: any) {
            console.log('Fastest is ' + this.filter('fastest').map('name'))
        })
        .run({ 'async': true })
}

runBenchmark()