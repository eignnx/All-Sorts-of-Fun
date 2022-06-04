const N = 500
const FRAMERATE = 100
const SORT_NAME = (
  // "simple bubblesort"
  // "better bubblesort"
  // "simple pivot quicksort" // 392.38
  "median of 3 quicksort"  // 436.46
  // "pseudomedian quicksort" // 418.33
  // "quick mean sort"
)
const INIT_METHOD = (
  // "true random"
  "perlin noise"
)
const PERLIN_NOISE_SCALE = 0.06

const SEED = (
  // null
  // 1234
  89234759283745
)

let array
let sorter
let score = 0

function setup() {
  createCanvas(400, 400)
  
  if (SEED !== null) {
    randomSeed(SEED)
    noiseSeed(SEED)
  }
  
  array = randomArray(N)
  noStroke()
  fill(255)
  sorter = sorts[SORT_NAME](array)
  frameRate(FRAMERATE)
  
}

function draw() {
  background("rgb(167,175,206)")
  const {value, done} = sorter.next()
  if (done) {
    noLoop()
    console.log(`final score = ${nf(100 * score, 2, 2)}`)
    displayArray(array, {})
  } else {
    if (value.hasOwnProperty("score")) {
      score += value.score
      delete value.score
    }
    displayArray(array, value)
  }
}

function displayArray(arr, highlighted) {
  const w = width / N
  for (const [idx, ele] of arr.entries()) {
    fill(255)
    noStroke()
    for (const [color, indices] of Object.entries(highlighted)) {
      if (indices.includes(idx)) {
        fill(color)
      }
    }
    const x = idx * w
    const h = ele * height
    rect(x, height, w, -h)
    
    fill(0)
    rect(x, height-h, w, w)
  }
}

let ticks = 0
function perlinNoise() {
  ticks++
  return noise(ticks * PERLIN_NOISE_SCALE)
}

const initMethods = {
  "true random": () => random(0, 1),
  "perlin noise": perlinNoise
}

function randomArray(len) {
  let array = []
  for (let i = 0; i < N; i++) {
    array.push(initMethods[INIT_METHOD]())
  }
  return array
}
