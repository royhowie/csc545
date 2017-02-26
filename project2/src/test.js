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
