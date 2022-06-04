p5.disableFriendlyErrors = true

const FRAMERATE = 60

let N = 100
const PERLIN_NOISE_SCALE = 0.06

const SEED = (
  null
  // 1234
  // 89234759283745
)

const BG_COLOR = "#e8f7ff"

let array
let sorter
let score = 0

const arrSizeInput = document.getElementById("arr-size")
const playModeBtn = document.getElementById("play-mode-btn")
const infoSection = document.getElementById("info-section")

function setMessage(m) {
  infoSection.textContent = m
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

let selectedSortName = Object.keys(SORTS)[0]
let selectedInitMethod = Object.keys(initMethods)[0]

function initUI() {
  const algSelect = document.getElementById("alg-select")
  for (const sortName of Object.keys(SORTS)) {
    const o = document.createElement("option")
    o.value = sortName
    o.textContent = sortName
    algSelect.appendChild(o)
  }
  algSelect.onchange = function() {
    selectedSortName = this.value
  }

  const initMethodSelect = document.getElementById("init-method-select")
  for (const initMethodName of Object.keys(initMethods)) {
    const o = document.createElement("option")
    o.value = initMethodName
    o.textContent = initMethodName
    initMethodSelect.appendChild(o)
  }
  initMethodSelect.onchange = function() {
    selectedInitMethod = this.value
  }

  playModeBtn.onclick = function() {
    if (this.textContent === "Start") {
      this.textContent = "Stop"
      initSortRun()
      loop()
    } else if (this.textContent === "Stop") {
      this.textContent = "Start"
      noLoop()
    }
  }
}

function initSortRun() {
  if (SEED !== null) {
    randomSeed(SEED)
    noiseSeed(SEED)
  }

  score = 0
  setMessage("")
  N = +arrSizeInput.value
  array = randomArray(N)
  sorter = SORTS[selectedSortName](array)
}

function setup() {
  createCanvas(400, 400).parent("p5-canvas-container")

  initUI()
  
  noStroke()
  frameRate(FRAMERATE)

  noLoop()
}

function draw() {
  background(BG_COLOR)
  const {value, done} = sorter.next()
  if (done) {
    noLoop()
    playModeBtn.textContent = "Start"
    setMessage(`final score = ${nf(100 * score, 2, 2)}`)
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
  noStroke()
  for (const [idx, ele] of arr.entries()) {
    
    colorMode(HSB, 100)
    fill((1-ele) * 100, 35, 100)
    colorMode(RGB)
    
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


function randomArray(len) {
  let array = []
  for (let i = 0; i < len; i++) {
    array.push(initMethods[selectedInitMethod]())
  }
  return array
}
