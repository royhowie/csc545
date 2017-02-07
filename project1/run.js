let Tree = require('./general.js').Tree
let Puzzle = require('./puzzle.js').Puzzle
let Node = require('./node.js').Node
let PriorityQueue = require('priorityqueuejs')

class A_Node extends Node {
  constructor (hash, parent, depth, goal) {
    super(hash, parent)
    this.g = depth
    this.h = Puzzle.heuristic(hash, goal, 3)
    this.score = this.g + this.h
  }
}

const GOAL_HASH = {
  3: '123456780',
  4: '123456789abcdef0',
}

let size = 3
let goal = GOAL_HASH[3]

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

console.log('name len success open closed depth')
for (let i = 0; i < 10; i++) {
  let puzzle = new Puzzle(size).puzzle
  let hash = Puzzle.hash(puzzle)

  let pq = new PriorityQueue((a, b) => b.score - a.score)
  // let pq = new PriorityQueue((a, b) => a.score - b.score)

  new Tree(hash, size, methods.BFS, 'BFS').search(goal, [], Node)
  new Tree(hash, size, methods.DFS, 'DFS').search(goal, [], Node)
  new Tree(hash, size, methods.Astar, 'A*').search(goal, pq, A_Node)
}
