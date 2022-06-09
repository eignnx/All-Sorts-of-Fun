const SCAN_COLOR = "#ebc334" // Gold colored

class Scan {
  constructor(i) {
    this.i = i
  }

  apply(indices) {
    indices[this.i] = SCAN_COLOR
  }
}