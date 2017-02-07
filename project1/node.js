class Node {
  constructor (hash, parent) {
    this.hash = hash
    this.parent = parent
    this.children = []
  }
}

module.exports = { Node }
