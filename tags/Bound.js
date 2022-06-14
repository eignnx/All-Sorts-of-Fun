const BOUND_COLOR = "#c120c9" // Magenta colored

class Bound extends Tag {
  constructor(i) {
    super()
    this.i = i
  }

  apply(state) {
    state.colors[this.i] = BOUND_COLOR
  }
}