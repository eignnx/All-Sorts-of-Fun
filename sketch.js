const init_bg_color = "#e8f7ff"
const FRAMERATE = 100

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
    <button @click="sectionBreak" v-if="messages.length > 0">Section Break</button>
    <p v-for="msg in messages">{{ msg }}</p>
  </section>
  <section>
    <details v-for="(sizes, sortName) in runData.data">
      <summary>{{ sortName }}</summary>
      <details v-for="(initMethods, arrSize) in sizes">
        <summary>{{ arrSize }} elements</summary>
        <details v-for="(runs, initMethod) in initMethods">
          <summary>{{ initMethod }}</summary>
          <table>
            <thead>
              <tr>
                <th v-for="(_, attr) in runs[0]">{{attr}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="run in runs">
                <td v-for="(value, attr) in run">
                  {{value}}
                </td>
              </tr>
            </tbody>
            <tfoot v-if="runs.length > 1">
              <tr>
                <th>Averages</th>
              </tr>
              <tr>
                <td v-for="(avg, attr) in runData.getAverages(sortName, arrSize, initMethod)">{{avg}}</td>
              </tr>
            </tfoot>
          </table>
        </details>
      </details>
    </details>
  </section>
</section>
  `,

  data: () => ({
    arrSize: 256,
    n: null,
    sortName: "random pivot quicksort",
    initMethod: "true random",
    running: false,
    messages: [],
    runData: new Data(),
    sortState: null,
  }),
  
  computed: {
    sortNames: () => Object.keys(SORTS),
    initMethodNames: () => Object.keys(INIT_METHODS(this.n)),
  },
  
  mounted() {
    const sketch = pParam => {

      // Let's just hold onto this...
      p = pParam
      
      const BG_COLOR = p.color(init_bg_color)

      let nextSendValue = undefined
      let done = false
      
      p.setup = () => {
        p.createCanvas(p.windowWidth, 400)
        p.noStroke()
        p.frameRate(FRAMERATE)
        p.background(BG_COLOR)
        p.noLoop()
        p.strokeCap(p.SQUARE)
        p.noSmooth()
      }
    
      p.draw = () => {
        if (!p.isLooping()) return
        
        let cmd = null

        while (!done && !(cmd instanceof ShowFrame)) {
          const status = sorter.next(nextSendValue)
          done = status.done
          cmd = status.value

          if (!done) {
            // nextSendValue will contain a value computed (if any) by a Cmd's
            // apply method, and fed back to the generator. `nextSendValue`
            // will be the value returned by a `yield` expression.
            nextSendValue = cmd.apply(this.sortState)
          }
        }
      
        this.displayArray(p, this.sortState.arr)
        
        if (done) {
          this.startStop()
          nextSendValue = undefined
          done = false
          this.addRunData()
        }
      }
    }
    
    p5.disableFriendlyErrors = true
    new p5(sketch, "p5-canvas-container")
  },

  methods: {
    resetSortState() {
      this.sortState = {
        arrSize: this.arrSize,
        sortName: this.sortName,
        initMethod: this.initMethod,
        colors: Array(this.n).fill(null),
        comparisons: 0,
        loads: 0,
        stores: 0,
        swaps: 0,
        arr: array,
      }
    },

    addRunData() {
      const {sortName, arrSize, initMethod, ...info} = this.getRunData()
      this.runData.addRunResults(sortName, arrSize, initMethod, info)
    },
    
    addMessage(msg) {
      this.messages.push(msg)
    },

    getRunData() {
      return sliceObject(this.sortState, [
        "arrSize",
        "sortName",
        "initMethod",
        "comparisons",
        "loads",
        "stores",
        "swaps",
      ])
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
      const selectedInitMethod = INIT_METHODS(this.n)[this.initMethod]
      array = randomArray(this.n, selectedInitMethod)
      sorter = SORTS[this.sortName](array)
      this.resetSortState()
    },
    
    displayArray(p, arr) {
      const w = p.width / this.n

      const eraseBar = idx => {
        if (idx < 0 || idx >= arr.length) return
        const ele = arr[idx]
        const x = idx * w
        const h = ele * p.height
        
        // Erase this element and half of each of its neighbors
        p.strokeWeight(w * 2)
        p.stroke(init_bg_color)
        p.line(x, p.height, x, 0)
      }

      
      const renderBar = idx => {
        if (idx < 0 || idx >= arr.length) return
        const ele = arr[idx]
        const h = ele * p.height
        const x = idx * w
        const c = this.sortState.colors[idx] ?? null
        
        if (c === null) {
          p.colorMode(p.HSB, 100)
          p.stroke((1 - ele) * 100, 35, 100)
          p.colorMode(p.RGB)
          delete this.sortState.colors[idx]
        } else {
          p.stroke(c)
          this.sortState.colors[idx] = null
        }

        p.strokeWeight(w)
        p.line(x, p.height, x, p.height - h)
        
        p.stroke(0)
        p.point(x, p.height - h)
      }

      for (const idxStr in {...this.sortState.colors}) {
        const idx = parseInt(idxStr)
        eraseBar(idx)
        renderBar(idx)
        renderBar(idx - 1)
        renderBar(idx + 1)
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
