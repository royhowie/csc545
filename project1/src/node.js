class Node {
  constructor (hash, parent) {
    this.hash = hash
    this.parent = parent
    this.children = []
  }
}

class A_Node extends Node {
  constructor (hash, parent, depth, goal) {
    super(hash, parent)
    this.g = depth
    this.h = Puzzle.heuristic(hash, goal, 3)
    this.score = this.g + this.h
  }
}

module.exports = { Node, A_Node }
