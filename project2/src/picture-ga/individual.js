let gd = require('node-gd')

const MUT_CHANCE = {
  chromosome: 25,
  gene: 3,
  new_point: 3,
  lose_point: 5,
}

const WIGGLE = 2

let COUNTER = 0

let rand_in_range = (min, max) => min + (Math.random() * (max - min)) | 0
let put_in_range = (num, min, max) => Math.max(min, Math.min(num, max))

let chunk_color = (color) => {
  let r = (color >> 16) % 256
  let g = (color >> 8) % 256
  let b = (color >> 0) % 256

  return [ r, g, b ]
}

// Ensure a number is at least 6 digits long.
let pad_num = (num) => {
  if (num < 10)           return '00000' + num
  else if (num < 100)     return '0000' + num
  else if (num < 1000)    return '000' + num
  else if (num < 10000)   return '00' + num
  else if (num < 100000)  return '0' + num
  else                    return '' + num
}

class Gene {
  constructor (color=null, num_points=3, width=100, height=100) {
    this.color = color || Gene.random_color()
    this.points = []
    this.num_points = num_points
    this.width = width
    this.height = height

    // Create a random polygon.
    for (let i = 0; i < this.num_points; i++) {
      this.points[2*i] = rand_in_range(0, width+1)
      this.points[2*i+1] = rand_in_range(0, height+1)
    }
  }

  clone () {
    let copy = new Gene()
    copy.color = this.color.slice()
    copy.points = this.points.slice()
    copy.num_points = this.num_points
    copy.width = this.width
    copy.height = this.height

    return copy
  }

  getPointArray () {
    let arr = []
    for (let i = 0; i < this.num_points; i++) {
      arr.push({ x: this.points[2*i], y: this.points[2*i+1]})
    }
    return arr
  }

  mutate () {
    // Either change the color, wiggle a point, or add a new point.
    // 1 in 2 chance to change color
    if (rand_in_range(0, 2) === 0) {
      // Change the color:
      for (let i = 0; i < 3; i++) {
        let change = rand_in_range(-WIGGLE, WIGGLE)
        this.color[i] = put_in_range(this.color[i] + change, 0, 255)
      }
      let change = rand_in_range(-WIGGLE, WIGGLE)
      this.color[3] = put_in_range(this.color[3] + change, 0, 127)
    // 1 in 2 chance to wiggle a point
    } else {
      let index = 2 * rand_in_range(0, this.num_points)
      let new_x = this.points[index] + rand_in_range(-WIGGLE, WIGGLE)
      let new_y = this.points[index+1] + rand_in_range(-WIGGLE, WIGGLE)

      this.points[index] = put_in_range(new_x, 0, this.width)
      this.points[index+1] = put_in_range(new_y, 0, this.height)
    }

    // 1 in 3 chance to add a new point
    if (rand_in_range(0, MUT_CHANCE.new_point) === 1) {
      this.points.push(rand_in_range(0, this.width))
      this.points.push(rand_in_range(0, this.height))
      this.num_points += 1
    }

    // 1 in 3 chance to lose a point
    if (rand_in_range(0, MUT_CHANCE.lose_point) === 1 && this.num_points > 3) {
      let index = rand_in_range(0, this.num_points)
      this.points.splice(2 * index, 2)
      this.num_points -= 1
    }
  }

  toString () {
    return `[color:${this.color.join()};points:${this.points.join()};width=${this.width};height=${this.height}]`
  }

  // returns random RGBA color as an array
  static random_color () {
    let r = rand_in_range(0, 256)
    let g = rand_in_range(0, 256)
    let b = rand_in_range(0, 256)
    let a = rand_in_range(0, 128)

    return [r, g, b, a]
  }
}

class Individual {
  constructor (chromo_len=50, width, height) {
    this.DNA = []
    this.width = width
    this.height = height
    for (let i = 0; i < chromo_len; i++) {
      this.DNA[i] = new Gene(null, 3, width, height)
    }
  }

  toString () {
    return `DNA:\n\t${this.DNA.map(_ => _.toString()).join('\n\t')}\n\tname2:${this.name2}`
  }

  attemptMutation () {
    // 1 in 100 chance to mutate
    // if (rand_in_range(0, MUT_CHANCE.individual) !== 1) return;

    // If selected for mutation, each gene has a 1 in 10 chance to mutate.
    for (let i = 0; i < this.DNA.length; i++) {
      if (rand_in_range(0, MUT_CHANCE.gene) === 1) {
        this.DNA[i].mutate()
      }
    }

    

    // 1 in 25 chance to either gain or lose a gene
    // if (rand_in_range(0, MUT_CHANCE.chromosome) === 1) {
    //   let rand_index = rand_in_range(0, this.DNA.length)
    //   // 50-50 chance to add or lose a gene
    //   if (rand_in_range(0, 2) === 0 && this.DNA.length > 20) {
    //     this.DNA.splice(rand_index, 1)
    //   } else {
    //     this.DNA.splice(rand_index, 0, new Gene())
    //   }
    // }

    return this
  }

  clone () {
    let copy = new Individual()

    copy.DNA = this.DNA.map(gene => gene.clone())
    copy.width = this.width
    copy.height = this.height

    return copy
  }

  destroy () {
    if (this.img)
      this.img.destroy()
  }

  fitness (goal) {
    if (this.fitness_val) return this.fitness_val

    this.img = gd.createTrueColorSync(this.width, this.height)

    this.img.alphaBlending(0)
    this.img.saveAlpha(1)

    let blank_color = gd.trueColorAlpha(255, 255, 255, 127)
    this.img.filledRectangle(0, 0, this.width, this.height, blank_color)
    this.img.alphaBlending(1)

    for (let i = 0; i < this.DNA.length; i++) {
      let fill = gd.trueColorAlpha(...this.DNA[i].color)
      let points = this.DNA[i].getPointArray()
      this.img.filledPolygon(points, fill)
    }

    this.name = pad_num(COUNTER++)

    let diff = 0.0
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        let goal_pixel = goal.getTrueColorPixel(i, j)
        let this_pixel = this.img.getTrueColorPixel(i, j)

        let chunk_goal = chunk_color(goal_pixel)
        let chunk_this = chunk_color(this_pixel)

        for (let i = 0; i < 3; i++) {
          diff += Math.pow(chunk_goal[i] - chunk_this[i], 2)
        }
      }
    }

    let max_diff = 0.001 * Math.pow(255, 3) * this.width * this.height
    return this.fitness_val = diff / max_diff
  }

  mate (that) {
    // Individuals can have chromosomes of varying lengths
    let max_len = Math.min(this.DNA.length, that.DNA.length)

    // Pick two indices to perform a 2-point crossover of genetic information.
    let a = rand_in_range(0, max_len)
    let b = rand_in_range(0, max_len)

    // Swap the genes at each of these locations.
    for (let i = Math.min(a, b); i < Math.max(a, b); i++) {
      let temp = this.DNA[i]
      this.DNA[i] = that.DNA[i]
      that.DNA[i] = temp
    }

    // Return a daughter and son.
    return [ this, that ]
  }

  paint () {
    this.img.savePng(`./output/${this.name}.png`, 0)
    this.img.destroy()
  }
}

module.exports = { Individual }
