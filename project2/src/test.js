let GA = require('./genetic_algorithm.js').GeneticAlgorithm
let MUT_CHANCE = { individual: 100, gene: 25 }
const TRIALS = 500

// hold console.log hostage for testing
let logger = console.log.bind(console)
console.log = () => {}

let keep_playing = () => {
  let i = 0
  let last_fitness = 0
  let gap = 0
  return (instance) => {
    if (last_fitness === instance.max_fitness) {
      return ++gap < 1000
    } else {
      gap = 0
    }
    last_fitness = instance.max_fitness
    return i++ < 100000 && instance.max_fitness < 23.97
  }
}

if (false) {
  logger('pop_size,generations,calls_of_f(x),average_max_fitness')

  for (let i = 1; i < 41; i++) {
    let population = 6 * i
    let generations = 0.0
    let calls = 0.0
    let fitness = 0.0

    for (let j = 0; j < TRIALS; j++) {
      let ga = new GA(population, 20, MUT_CHANCE)
      ga.play(keep_playing())

      fitness += ga.max_fitness
      generations += ga.generation
      calls += ga.fitness_calls
    }

    logger([ population, generations / TRIALS, calls / TRIALS,
      fitness / TRIALS ].join(','))
  }
} else {
  const POP_SIZE = 70
  let mut_chance = MUT_CHANCE
  // let individual_options = [5, 10, 25, 50, 100, 200, 250, 500, 1000, 10000]
  // [16, 32, 64, 128, 256, 512, 1024]

  let individual_options = [10, 50, 100, 250, 500, 1000]

  for (let i = 0; i < individual_options.length; i++) {
    mut_chance.individual = individual_options[i]
    logger('MUT_RATE=' + individual_options[i])

    const MAX_GEN = 100
    let avg_fitness = Array(MAX_GEN).fill(0)
    let max_fitness = Array(MAX_GEN).fill(0)

    for (let j = 0; j < TRIALS; j++) {
      let ga = new GA(POP_SIZE, 20, mut_chance)
      let gens = 0
      ga.play((instance) => {
        avg_fitness[gens] += ga.average
        max_fitness[gens] += ga.max_fitness
        return ++gens < MAX_GEN
      })
    }

    logger('generation,avg_fitness,max_fitness')
    for (let j = 0; j < MAX_GEN; j++) {
      logger(`${j},${avg_fitness[j]/TRIALS},${max_fitness[j]/TRIALS}`)
    }

    logger('\n')
  }
}
