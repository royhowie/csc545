let Tree = require('./general.js').Tree
let Puzzle = require('./puzzle.js').Puzzle
let nodes = require('./node.js')
let PriorityQueue = require('priorityqueuejs')

const { Node, A_Node } = nodes
const GOAL_HASH = { 3: '123456780', 4: '123456789abcdef0' }
const size = 3
const goal = GOAL_HASH[size]
const TRIALS = 1000

const methods = {
  BFS: {
    add: 'push',
    remove: 'shift',
    length: { call: 'length' },
  },
  DFS: {
    add: 'push',
    remove: 'pop',
    length: { call: 'length' },
  },
  Astar: {
    add: 'enq',
    remove: 'deq',
    length: { type: 'function', call: 'size' },
  },
}

console.log(
  [
    'index',
    'BFS_open', 'BFS_closed', 'BFS_depth',
    'DFS_open', 'DFS_closed', 'DFS_depth',
    'A*_open', 'A*_closed', 'A*_depth'
  ].join('\t')
)

for (let i = 0; i < TRIALS; i++) {
  let puzzle = new Puzzle(size).puzzle
  let hash = Puzzle.hash(puzzle)

  let pq = new PriorityQueue((a, b) => b.score - a.score)

  let a = new Tree(hash, size, methods.BFS, 'BFS').search(goal, [], Node)
  let b = new Tree(hash, size, methods.DFS, 'DFS').search(goal, [], Node)
  let c = new Tree(hash, size, methods.Astar, 'A*').search(goal, pq, A_Node)

  let results = [i, ...a, ...b, ...c]
  console.log(results.join('\t'))
}
