const SWAP_COLOR = "#eb4034" // Rust colored

class Swap {
  constructor(i, j) {
    this.i = i
    this.j = j
  }

  apply(indices) {
    indices[this.i] = SWAP_COLOR
    indices[this.j] = SWAP_COLOR
  }
}
