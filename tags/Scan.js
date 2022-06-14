const SCAN_COLOR = "#ffa600" // Gold colored

class Scan extends Tag {
  constructor(i) {
    super()
    this.i = i
  }

  apply(state) {
    state.colors[this.i] = SCAN_COLOR
  }
}