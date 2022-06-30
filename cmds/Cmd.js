class Cmd {
  thenShowFrame(...args) {
    return new ShowFrame(this, ...args)
  }
}

// Only use this if you are building new abstractions. It kinda breaks encapsulation...
NewlessCtor(
class UnsafeGetArr extends Cmd {
  apply(state) { return state.arr }
})

// Only use this if you are building new abstractions. It kinda breaks encapsulation...
NewlessCtor(
class UnsafeSetArr extends Cmd {
  constructor(newArr) {
    super()
    this.newArr = newArr
  }
  
  apply(state) { state.arr = this.newArr }
})

