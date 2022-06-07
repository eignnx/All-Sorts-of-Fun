let array = null
let p = null
let sorter = null
let perlinNoiseScale = 0.06

const vueApp = Vue.createApp({
  template: `
<section>
  <section id="ui-section">
    <div>
      <label for="arr-size">Array Size</label>
      <input
        id="arr-size"
        type="number"
        required
        v-model.number="arrSize"
      >
    </div>
    
    <div>
      <label for="alg-select">Sort Algorithm</label>
      <select
        id="alg-select"
        v-model="sortName"
      >
        <option v-for="name in sortNames">{{ name }}</option>
      </select>
    </div>
  
    <div>
      <label for="init-method-select">Array Initialization Method</label>
      <select
        id="init-method-select"
        v-model="initMethod"
      >
        <option v-for="name in initMethodNames">{{ name }}</option>
      </select>
    </div>
  
    <div>
      <button @click="startStop">
        {{ running ? "Stop" : "Start" }}
      </button>
    </div>
  </section>
  <section id="messages-section">
    <button @click="messages = []" v-if="messages.length > 0">Clear</button>
    <p v-for="msg in messages">{{ msg }}</p>
  </section>
</section>
  `,

  data: () => ({
    score: 0,
    arrSize: 1000,
    n: null,
    sortName: "simple pivot quicksort",
    initMethod: "true random",
    running: false,
    messages: [],
  }),
  
  computed: {
    sortNames: () => Object.keys(SORTS),
    initMethodNames: () => Object.keys(INIT_METHODS(this.n)),
  },
  
  mounted() {
    const sketch = pParam => {

      // Let's just hold onto this...
      p = pParam
      
      const FRAMERATE = 60
      const BG_COLOR = "#e8f7ff"
      
      p.setup = () => {
        p.createCanvas(p.windowWidth, 400)
        p.noStroke()
        p.frameRate(FRAMERATE)
        p.background(BG_COLOR)
        p.noLoop()
        p.strokeCap(p.SQUARE)
      }
    
      p.draw = () => {
        if (!p.isLooping()) return
        
        p.background(BG_COLOR)
        const {value, done} = sorter.next()
        
        if (done) {
          this.startStop()
          this.addMessage(`final score = ${100 * this.score}`)
          this.displayArray(p, array, {})
        } else {
          if (value.hasOwnProperty("score")) {
            this.score += value.score
            delete value.score
          }
          this.displayArray(p, array, value)
        }
      }
    }
    
    p5.disableFriendlyErrors = true
    new p5(sketch, "p5-canvas-container")
  },

  methods: {
    addMessage(msg) {
      this.messages.push(msg)
    },

    startStop() {
      if (!this.running) {
        this.initSortRun()
        p.loop()
      } else {
        p.noLoop()
      }
      this.running = !this.running
    },
    
    initSortRun() {
      if (SEED !== null) {
        p.randomSeed(SEED)
        p.noiseSeed(SEED)
        this.ticks = 0
      }

      this.n = this.arrSize
      this.score = 0
      const selectedInitMethod = INIT_METHODS(this.n)[this.initMethod]
      array = randomArray(this.n, selectedInitMethod)
      sorter = SORTS[this.sortName](array)
    },
    
    displayArray(p, arr, highlighted) {

      const colors = {}
      for (const [c, indices] of Object.entries(highlighted)) {
        indices.forEach(idx => colors[idx] = p.color(c))
      }
      
      const w = p.width / this.n
      p.strokeWeight(w)
      
      for (const [idx, ele] of arr.entries()) {
        
        const c = colors[idx]
        
        if (c !== undefined) {
          p.stroke(c)
        } else {
          p.colorMode(p.HSB, 100)
          p.stroke((1-ele) * 100, 35, 100)
          p.colorMode(p.RGB)
        }
        
        const x = idx * w
        const h = ele * p.height
        
        p.line(x, p.height, x, p.height - h)
        
        p.stroke(0)
        p.point(x, p.height - h)
      }
    }
  },
}).mount('#vue-app-root')


const SEED = (
  null
  // 1234
  // 89234759283745
)


function randomArray(len, r) {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(r(i))
  }
  return arr
}
