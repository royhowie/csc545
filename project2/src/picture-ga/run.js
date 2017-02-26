let gd = require('node-gd')
let GA = require('./genetic_algorithm.js').GeneticAlgorithm

let target = gd.createFromPng('./target/cropped2-small.png')
let polygons = 150
let ga = new GA(polygons, target, 160, 160)

ga.play((instance) => instance.population.fitness_val > 0.01)
