const PIVOT_COLOR = "#21bf53" // Green colored

class Pivot {
  constructor(i) {
    this.i = i
  }

  apply(indices) {
    indices[this.i] = PIVOT_COLOR
  }
}