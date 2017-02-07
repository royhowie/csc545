let Puzzle = require('./puzzle.js').Puzzle
let Node = require('./node.js').Node

const GOAL_HASH = {
  // 3: '123804765',
  3: '123456780',
  4: '123456789abcdef0',
}

class BFS {
  constructor (hash, len) {
    this.len = len
    this.root = new Node(hash, null)
    // Number of nodes visited
    this.closed = 0
    // Max length of the open list
    this.open = 1
  }

  search (size) {
    // Collection of seen hashes.
    let seen = new Set()
    let queue = [ this.root ]
    let leaf = null

    while (queue.length !== 0) {
      // Poll the queue for the next possible puzzle position
      let next = queue.shift()

      if (next.hash === GOAL_HASH[size]) {
        console.log('found terminal state!')
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
        if (seen.has(move)) return

        // Otherwise, create a new node.
        let node = new Node(move, next)

        // Record its existence in its parent's list of children.
        next.children.push(node)

        // Add it to the queue to be investigated.
        queue.push(node)
      })

      // If the open list is longer than it previously was, record it
      if (this.open < queue.length)
        this.open = queue.length
    }

    console.log(
      'Search concluded.\n',
      'length of open list:', this.open, '\n',
      'length of closed list:', this.closed, '\n',
      'puzzle size:', this.len + 'x' + this.len
    )

    let i = 0
    let path = []
    while (leaf !== null) {
      let d = Puzzle.display(leaf.hash, this.len).join('\n')
      path.push(d)
      leaf = leaf.parent
      i += 1
    }

    console.log(
      ' tree depth:', i, '\n',
      'path taken:'
    )

    while (path.length) {
      console.log(path.pop(), '\n')
    }
  }
}

let size = 3
let hash = Puzzle.hash(new Puzzle(size).puzzle)
// console.log(hash)
let tree = new BFS(hash, size)

tree.search(size)
