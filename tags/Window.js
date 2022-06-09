const WINDOW_COLOR = "#2163bf" // Blue colored

class Window {
  constructor(start, end) {
    this.start = start
    this.end = end
  }

  apply(indices) {
    for (let i = this.start; i < this.end; i++) {
      indices[i] = WINDOW_COLOR
    }
  }
}