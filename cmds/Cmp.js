class Cmp extends Cmd {
  constructor(a, b) {
    super()
    this.a = a
    this.b = b
  }

  apply(state) {
    state.comparisons += 1
    
    while (this.a instanceof Cmd)
      this.a = this.a.apply(state)
    
    while (this.b instanceof Cmd)
      this.b = this.b.apply(state)
    
    return this.constructor.cmp(this.a, this.b)
  }
}

NewlessCtor(
class Gt extends Cmp {
  static cmp = (a, b) => a > b
})

NewlessCtor(
class Lt extends Cmp {
  static cmp = (a, b) => a < b
})

NewlessCtor(
class Gte extends Cmp {
  static cmp = (a, b) => (a >= b)
})

NewlessCtor(
class Lte extends Cmp {
  static cmp = (a, b) => (a <= b)
})

NewlessCtor(
class Eq extends Cmp {
  static cmp = (a, b) => (a === b)
})