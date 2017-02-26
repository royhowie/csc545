let Individual = require('./individual.js').Individual

class GeneticAlgorithm {
  constructor (max_pop_size, chromo_len=20) {
    this.max_pop_size = max_pop_size
    this.chromo_len = chromo_len

    // Create an initial, random population of `max_pop_size` individuals.
    this.population = []
    for (let i = 0; i < this.max_pop_size; i++) {
      this.population[i] = new Individual(this.chromo_len)
    }

    // Record the number of times the `GeneticAlgorithm.fitness` is called; this
    // is an alternative way of counting the number of individuals encountered
    // throughout the algorithm's lifecycle.
    this.fitness_calls = 0
  }

  // Returns a fitness value between 1 (bad) and 100 (great)
  fitness (individual) {
    this.fitness_calls += 1
    return individual.fitness(this.goal)
  }

  play (should_continue) {
    console.log('gen,avg_fit,max_fit')
    let generation = 1

    this.max_fitness = -Infinity
    this.max_index = -1
    this.average = 0

    do {
      let cumulative_sum = [0]
      let sum = 0.0

      for (let i = 0; i < this.population.length; i++) {
        // Record the fitness of invidual #i
        let indiv_fit = this.fitness(this.population[i])

        // Keep track of the max fitness of this population
        if (this.max_fitness < indiv_fit) {
          this.max_fitness = indiv_fit
          this.max_index = i
        }

        // Keep a running total of the sum of the fitness values. This will be
        // used to randomly select individuals
        sum += indiv_fit
        // cumulative_sum[i] = sum
        cumulative_sum[i+1] = sum
      }

      // Average fitness value of population [for data purposes].
      this.average = sum / (cumulative_sum.length - 1)

      let next_pop = []
      for (let i = 0; i < this.population.length; i++) {
        let rand_fit_val = Math.random() * sum
        let random_index = GeneticAlgorithm.search(cumulative_sum, rand_fit_val)

        // clone the individual at `random_index-1` because GeneticAlgorithm.
        // search will return an index between 0 and pop_size inclusive.
        next_pop.push(this.population[random_index].clone())
      }

      // Mate individuals
      for (let i = 0; i < next_pop.length; i = i + 2) {
        let mother = next_pop[i]
        let father = next_pop[i + 1]

        let [ daughter, son ] = mother.mate(father)

        next_pop[i] = daughter
        next_pop[i + 1] = son
      }

      // Possibly mutate individuals
      for (let i = 0; i < next_pop.length; i++) {
        next_pop[i].attemptMutation()
      }

      // Destroy the old population (for memory purposes) and store the next
      // generation.
      // this.population.forEach(individual => { individual.destroy() })
      this.population = next_pop

      this.average

      console.log(`${generation},${this.average},${this.max_fitness}`)
      generation += 1
    } while (should_continue(this))

    let winner = this.population[this.max_index]
    console.log(`winner: (${winner.get_value()},${this.max_fitness})`)
    console.log(`calls to f(x): ${this.fitness_calls}`)
  }

  // Search for the last element which is less than `goal` and return its index.
  // For example, if weights := [1, 2, 3, 4, 5] and our array of cumulative sums
  // is array := [0, 1, 3, 6, 10, 15], then
  //    search(array, 0)    -> 0
  //    search(array, 1)    -> 1
  //    search(array, 3.5)  -> 2
  //    search(array, 12)   -> 4
  //    search(array, 15)   -> 4
  //    search(array, 9000) -> 5
  // Works for input not in [0, sum(array)], but is only intended to be used for
  // non-negative `goal`.
  static search (arr, goal) {
    let low = 0
    let high = arr.length - 1

    while (low != high) {
      let mid = Math.round((low + high) / 2)

      if (goal <= arr[mid]) {
        high = mid - 1
      } else {
        low = mid
      }
    }

    return low
  }
}

module.exports = { GeneticAlgorithm }
