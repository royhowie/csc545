let GA = require('./genetic_algorithm.js').GeneticAlgorithm

new GA(50, 20).play((instance) => instance.max_fitness < 23.97)
