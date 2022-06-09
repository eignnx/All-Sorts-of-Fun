const MIN_COLOR = "#e68612" // Orange colored

class Min {
  constructor(i) {
    this.i = i
  }

  apply(indices) {
    indices[this.i] = MIN_COLOR
  }
}