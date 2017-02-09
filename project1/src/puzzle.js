class Puzzle {
  constructor (size) {
    this.len = size
    this.puzzle = Puzzle.generatePuzzle(size)
    this.pos = this.puzzle.indexOf(0)
  }

  static hash (puzzle) {
    return puzzle.map(char => char.toString(16)).join('')
  }

  // The Taxicab Metric is an admissable heuristic.
  static heuristic (hash, goal, len) {
      let map_to_xy = (index) => {
        let row = index / len | 0
        let col = index % len
        return [ row, col ]
      }

      let score = 0
      for (let i = 1; i < len * len; i++) {
        let pos = map_to_xy(hash.indexOf(i))
        let goal = map_to_xy(i)
        score += Math.abs(pos[0] - goal[0]) + Math.abs(pos[1] - goal[1])
      }

      return score
  }

  static display (hash, len) {
    return Array.from(Array(len), (_,i) => {
      return hash.slice(i*len, (i+1)*len)
    })
  }

  static valid_moves (hash, len, pos) {
    if (pos === undefined)
      pos = hash.indexOf(0)

    /*
      example puzzle:
        1   2   3   4
        5   6   7   8
        9   10  11  12
        13  14  0   15

      [ note the 0-based indexing below ]
      pos: 14
      valid moves: 13, 15, 10
    */
    let moves = []
    let arr = hash.split('')

    if (pos % len !== 0)
      moves.push(pos - 1)     // add the position to the left
    if (pos % len !== len - 1)
      moves.push(pos + 1)     // add the position to the right
    if (pos >= len)
      moves.push(pos - len)   // add the position above
    if (pos < len * (len - 1))
      moves.push(pos + len)   // add the position below

    return moves.map(swap_index => {
      let copy = arr.slice()
      copy[pos] = copy[swap_index]
      copy[swap_index] = 0
      return copy.join('')
    })
  }

  static generatePuzzle (size) {
    let n2 = size * size
    let arr = Array.from(Array(n2), (_, i) => i)

    do {
      arr = Puzzle.shuffle(arr)
    } while (!Puzzle.is_valid(arr, n2))

    return arr
  }

  // see the following links
  // http://mathworld.wolfram.com/15Puzzle.html
  // http://www.geeksforgeeks.org/check-instance-15-puzzle-solvable/
  // http://www.geeksforgeeks.org/check-instance-8-puzzle-solvable/
  static is_valid (puzzle, tiles) {
    // `e` is the row number of the empty tile.
    let e = 1 + (puzzle.indexOf(0) / Math.sqrt(tiles) | 0)

    // `N` is the sum of permutation inverses in the list of numbers.
    let N = 0
    for (let i = 2; i < tiles; i++) {
      // Count the amount of tiles with a value less than `i` which occur after
      // the `i` tile. 0, the empty tile, should not be counted.
      //
      // For example, if the puzzle is [2, 1, 3, 4, ..., 15, 0], then the score
      // is N=1, since 1 < 2 and 1 occurs after 2; even though 0 < 2, it is not
      // included in this total.
      let start = puzzle.indexOf(i)
      for (let j = start; j < tiles; j++) {
        if (puzzle[j] !== 0 && puzzle[j] < i)
          N += 1
      }
    }

    // Consider a N by N puzzle. This puzzle is solvable for
    // N odd
    //    iff the number of inversions is even
    // N even
    //    1. blank on odd row and number of inversions is odd
    //    2. blank on even row and number of inversions is even
    // This can easily be written as:
    if (tiles % 2 === 1)
      return N % 2 === 0
    else
      return (N + e) % 2 === 0
  }

  static shuffle (arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      let rand = Math.random() * (i + 1) | 0
      let temp = arr[i]
      arr[i] = arr[rand]
      arr[rand] = temp
    }
    return arr
  }
}

module.exports = { Puzzle }
