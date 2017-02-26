const MAX = 1 << 20
const MUT_CHANCE = { individual: 100, gene: 25 }
let rand_in_range = (min, max) => min + (Math.random() * (max - min)) | 0
let f = (x) => {
  return 12 +
    10 * Math.cos(
      Math.log(
        0.1 + Math.pow(
          0.001 * x - 100,
          2
        )
      )
    ) - 2 * Math.sin(
      0.001 * x - 100
    )
}

class Individual {
  constructor (chromo_len=20) {
    this.DNA = Array(chromo_len).fill(0)
    let rand = rand_in_range(0, MAX).toString(2)
    let start = chromo_len - rand.length

    for (let i = 0; i < rand.length; i++) {
      this.DNA[start + i] = rand[i] === '0' ? 0 : 1
    }
  }

  attemptMutation () {
    // 1 in 100 chance to mutate
    if (rand_in_range(0, MUT_CHANCE.individual) !== 1) return this;

    // If selected for mutation, each gene has a 1 in 25 chance to mutate.
    for (let i = 0; i < this.DNA.length; i++) {
      if (rand_in_range(0, MUT_CHANCE.gene) === 1) {
        this.DNA[i] = 1 - this.DNA[i]
      }
    }

    return this
  }

  clone () {
    let copy = new Individual()
    copy.DNA = this.DNA.slice()
    return copy
  }

  get_value () {
    return parseInt(this.DNA.join(''), 2)
  }

  fitness () {
    return this.fitness_val = f(this.get_value())
  }

  mate (that) {
    // Individuals can have chromosomes of varying lengths
    let max_len = Math.min(this.DNA.length, that.DNA.length)

    // Pick two indices to perform a 2-point crossover of genetic information.
    let a = rand_in_range(0, max_len)
    let b = rand_in_range(0, max_len)

    // Swap the genes at each of these locations.
    for (let i = Math.min(a, b); i < Math.max(a, b); i++) {
      if (this.DNA[i] !== that.DNA[i]) {
        this.DNA[i] = 1 - this.DNA[i]
        that.DNA[i] = 1 - that.DNA[i]
      }
    }

    // Return a daughter and a son.
    return [ this, that ]
  }
}

module.exports = { Individual }
