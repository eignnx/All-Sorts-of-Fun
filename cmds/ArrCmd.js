class ArrCmd extends Cmd {}

NewlessCtor(
class Load extends ArrCmd {
  constructor(idx) {
    super()
    this.idx = idx
  }

  apply(state) {
    state.cache.load(this.idx)
    state.loads += 1
    return state.arr[this.idx]
  }
})

NewlessCtor(
class Store extends ArrCmd {
  constructor(idx, value) {
    super()
    this.idx = idx
    this.value = value
  }

  apply(state) {
    state.cache.store(this.idx, this.value)
    state.stores += 1
    state.arr[this.idx] = this.value
  }
})

NewlessCtor(
class Swap extends ArrCmd {
  static color = "#eb4034" // Rust colored
  
  constructor(i, j) {
    super()
    this.i = i
    this.j = j
  }

  apply(state) {
    if (this.i === this.j) return null
    
    const iVal = state.cache.load(this.i)
    const jVal = state.cache.load(this.j)
    state.cache.store(this.i, jVal)
    state.cache.store(this.j, iVal)
    
    state.swaps += 1
    state.loads += 2
    state.stores += 2
    state.colors[this.i] = state.colors[this.j] = Swap.color
    const oldI = state.arr[this.i]
    const oldJ = state.arr[this.j]
    state.arr[this.j] = oldI
    state.arr[this.i] = oldJ
    return [oldI, oldJ]
  }
})

NewlessCtor(
class GetLength extends ArrCmd {
  apply(state) {
    return state.arr.length
  }
})