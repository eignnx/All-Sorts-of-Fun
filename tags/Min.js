const MIN_COLOR = "#e68612" // Orange colored

class Min extends Tag {
  constructor(i) {
    super()
    this.i = i
  }

  apply(state) {
    state.colors[this.i] = MIN_COLOR
  }
}