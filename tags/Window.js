const WINDOW_COLOR = "#2163bf" // Blue colored

class Window extends Tag {
  constructor(start, end) {
    super()
    this.start = start
    this.end = end
  }

  apply(state) {
    for (let i = this.start; i < this.end; i++) {
      state.colors[i] = WINDOW_COLOR
    }
  }
}