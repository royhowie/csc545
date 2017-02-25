let gd = require('node-gd')
let GA = require('./genetic_algorithm.js').GeneticAlgorithm

let target = gd.createFromPng('./target/cropped2.png')
let population = 50
let polygons = 20
let ga = new GA(population, polygons, target, 450, 450)

let i = 0
ga.play(() => i++ < 1000)
