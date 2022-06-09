const BOUND_COLOR = "#c120c9" // Magenta colored

class Bound {
  constructor(i) {
    this.i = i
  }

  apply(indices) {
    indices[this.i] = BOUND_COLOR
  }
}