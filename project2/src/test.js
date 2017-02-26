let GA = require('./genetic_algorithm.js').GeneticAlgorithm
let MUT_CHANCE = { individual: 100, gene: 25 }

let logger = console.log.bind(console)

// hold console.log hostage for testing
console.log = () => {}

let keep_playing = () => {
  let i = 0
  return (instance) => i++ < 100000 && instance.max_fitness < 23.9
}

logger('pop_size,generations,calls_of_f(x)')
for (let i = 1; i < 26; i++) {
  let population = 6 * i
  let generations = 0.0
  let calls = 0.0
  for (let j = 0; j < 250; j++) {
    let ga = new GA(population, 20, MUT_CHANCE)
    ga.play(keep_playing())
    generations += ga.generation
    calls += ga.fitness_calls
  }
  logger(`${population},${generations/100},${calls/100}`)
}
