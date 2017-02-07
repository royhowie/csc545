let Puzzle = require('./puzzle.js').Puzzle

class Tree {
  constructor (hash, len, methods, name='BFS') {
    this.hash = hash
    this.len = len
    this.name = name
    this.closed = 0   // Number of nodes visited
    this.open = 1     // Max length of the open list
    this.methods = methods
  }

  search (goal, list, Node) {
    // Collection of seen hashes.
    let seen = new Set()
    let leaf = null

    let add_item = list[this.methods.add].bind(list)
    let remove_item = list[this.methods.remove].bind(list)
    let length_closure = () => {
      if (this.methods.length.type === 'function') {
        let fn = list[this.methods.length.call].bind(list)
        return () => fn()
      }
      return () => list[this.methods.length.call]
    }
    let length = length_closure()

    this.root = new Node(this.hash, null, 0, goal)
    add_item(this.root)

    while (length() !== 0) {
      // Poll the queue for the next possible puzzle position
      let next = remove_item()

      if (next.hash === goal) {
        leaf = next
        break
      }

      // If a move has already been investigated, skip it.
      if (seen.has(next.hash)) continue

      // Otherwise, add its hash to the set of seen hashes.
      seen.add(next.hash)

      // New node has been visited, so record that.
      this.closed += 1

      // Find all possible, unobserved moves...
      Puzzle.valid_moves(next.hash, this.len).forEach(move => {
        // If a move has been seen before, ignore it
        if (!seen.has(move)) {
          // Otherwise, create a new node.
          let node = new Node(move, next, next.depth + 1, goal)

          // Record its existence in its parent's list of children.
          next.children.push(node)

          // Add it to the queue to be investigated.
          add_item(node)
        }
      })

      // If the open list is longer than it previously was, record it
      if (this.open < length())
        this.open = length()
    }

    let success = leaf !== null ? 1 : 0
    let i = 0
    while (leaf !== null) {
      leaf = leaf.parent
      i += 1
    }

    console.log(this.name, this.len, success, this.open, this.closed, i)
  }
}

module.exports = { Tree }
