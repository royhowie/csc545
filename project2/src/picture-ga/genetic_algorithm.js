let Individual = require('./individual.js').Individual

class GeneticAlgorithm {
  constructor (chromo_len=50, goal, width, height) {
    this.chromo_len = chromo_len
    this.goal = goal
    this.width = width
    this.height = height

    this.population = new Individual(this.chromo_len, width, height)

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
    console.log('gen,avg_fit')
    let generation = 1
    do {
      /*
        let [ mother, father ] = this.population
        let [ daughter, son ] = mother.clone().mate(father.clone())

        daughter.attemptMutation()
        son.attemptMutation()

        let next_pop = [ mother, father, daughter, son ]

        // console.log('next_pop', next_pop)

        let fitness_val = next_pop.map(individual => {
          // console.log('called fitness on', individual.name)
          return this.fitness(individual)
        })

        next_pop = next_pop.sort((a, b) => a.fitness_val - b.fitness_val)

        // Destroy the old population (for memory purposes) and store the next
        // generation.
        this.population.forEach(individual => {
          individual.paint()
          individual.destroy()
        })
        this.population = next_pop.slice(0, 2)

        let average = (next_pop[0].fitness_val + next_pop[1].fitness_val) / 2
      */
      let parent = this.population
      let child = this.population.clone().attemptMutation()

      let parent_fitness = this.fitness(parent)
      let child_fitness = this.fitness(child)

      if (parent_fitness > child_fitness) {
        parent.paint()
        this.population = child

        console.log(`${generation},${this.population.fitness_val}`)
        generation += 1
      } else {
        child.destroy()
      }
    } while (should_continue(this))
  }
}

module.exports = { GeneticAlgorithm }
