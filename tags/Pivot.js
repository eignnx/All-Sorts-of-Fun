const PIVOT_COLOR = "#21bf53" // Green colored

class Pivot extends Tag {
  constructor(i) {
    super()
    this.i = i
  }

  apply(state) {
    state.colors[this.i] = PIVOT_COLOR
  }
}