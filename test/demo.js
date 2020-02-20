const fs = require("fs")
const loader = require("@assemblyscript/loader")

const myImports = {}
const myModule = loader.instantiateSync(
    fs.readFileSync("./dist/untouched.wasm"),
    myImports
)

const { Node, QuadTree, PointItem, BoundsItem } = myModule
// console.log(myModule)

let q = new QuadTree()
q.insert([
    new PointItem(1, 2, 3, null)
])

let n = new Node(new BoundsItem(0, 0, 10, 10), 10)
// console.log(Node.TOP_LEFT)
// console.log(n.isEmpty())
console.log(n.getDescendantsNum())