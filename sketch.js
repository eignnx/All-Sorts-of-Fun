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
  <article>
    <button @click="messages = []" v-if="messages.length > 0">Clear</button>
    <p v-for="msg in messages">{{ msg }}</p>
  </article>
</section>
  `,

  data: () => ({
    sketch: null,
    p: null,
    array: null,
    sorter: null,
    score: 0,
    arrSize: 100,
    n: 100,
    sortName: "basic bubblesort",
    initMethod: "true random",
    perlinNoiseScale: 0.06,
    running: false,
    messages: [],
  }),
  
  computed: {
    sortNames: () => Object.keys(SORTS),
    initMethodNames: () => Object.keys(INIT_METHODS(this.n)),
  },
  
  mounted() {
    const sketch = p => {

      // Let's just hold onto this...
      this.p = p
      
      const FRAMERATE = 50
      const BG_COLOR = "#e8f7ff"
      
      p.setup = () => {
        p.createCanvas(p.windowWidth, 400)
        p.noStroke()
        p.frameRate(FRAMERATE)
        p.background(BG_COLOR)
        p.noLoop()
      }
    
      p.draw = () => {
        if (!p.isLooping()) return
        
        p.background(BG_COLOR)
        const {value, done} = this.sorter.next()
        
        if (done) {
          this.startStop()
          this.addMessage(`final score = ${100 * this.score}`)
          this.displayArray(p, this.array, {})
        } else {
          if (value.hasOwnProperty("score")) {
            this.score += value.score
            delete value.score
          }
          this.displayArray(p, this.array, value)
        }
      }
    }
    
    // p5.disableFriendlyErrors = true
    this.sketch = new p5(sketch, "p5-canvas-container")
  },

  methods: {
    addMessage(msg) {
      this.messages.push(msg)
    },

    startStop() {
      if (!this.running) {
        this.initSortRun()
        this.p.loop()
      } else {
        this.p.noLoop()
      }
      this.running = !this.running
    },
    
    initSortRun() {
      if (SEED !== null) {
        this.p.randomSeed(SEED)
        this.p.noiseSeed(SEED)
        this.ticks = 0
      }

      this.n = this.arrSize
      this.score = 0
      const selectedInitMethod = INIT_METHODS(this.n)[this.initMethod]
      this.array = randomArray(this.n, selectedInitMethod)
      this.sorter = SORTS[this.sortName](this.array)
    },
    
    displayArray(p, arr, highlighted) {
      const w = p.width / this.n
      p.noStroke()
      for (const [idx, ele] of arr.entries()) {
        
        p.colorMode(p.HSB, 100)
        p.fill((1-ele) * 100, 35, 100)
        p.colorMode(p.RGB)
        
        for (const [color, indices] of Object.entries(highlighted)) {
          if (indices.includes(idx)) {
            p.fill(color)
          }
        }
        
        const x = idx * w
        const h = ele * p.height
        p.rect(x, p.height, w, -h)
        
        p.fill(0)
        p.rect(x, p.height - h, w, w)
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
  const array = []
  for (let i = 0; i < len; i++) {
    array.push(r(i))
  }
  return array
}
