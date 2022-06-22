class Cmd {
  thenShowFrame(...args) {
    return new ShowFrame(this, ...args)
  }
}


// Only use this if you are building new abstractions. It kinda breaks encapsulation...
NewlessCtor(
class UnsafeGetSubslice extends Cmd {
  apply(state) { return state.arr }
})

// Only use this if you are building new abstractions. It kinda breaks encapsulation...
NewlessCtor(
class UnsafeSetSubslice extends Cmd {
  constructor(newSubslice) {
    super()
    this.newSubslice = newSubslice
  }
  
  apply(state) { state.arr = this.newSubslice }
})


function* inSubslice(range, genFn) {
  const s = yield unsafeGetSubslice()

  yield unsafeSetSubslice(s.subslice(range))
  const ret = yield* genFn()
  yield unsafeSetSubslice(s)
  
  return ret
}

/*
function* dualPivotQuicksort(arr, start=0, end=arr.length) {
  const len = end - start
  if (len < 2) return
  const [pivotA, pivotB] = [start, end - 1]
  const [pivot1, pivot2] = yield* dualPivotPartition([pivotA, pivotB])

  yield* inSubslice([         0,   pivot1], dualPivotQuicksort) // Section 1
  yield* inSubslice([pivot1 + 1,   pivot2], dualPivotQuicksort) // Section 2
  yield* inSubslice([pivot2 + 1, Infinity], dualPivotQuicksort) // Section 3

  yield* inSubslice({from:        0, until:   pivot1}, dualPivotQuicksort) // Section 1
  yield* inSubslice({from: pivot1+1, until:   pivot2}, dualPivotQuicksort) // Section 2
  yield* inSubslice({from: pivot2+1, until: Infinity}, dualPivotQuicksort) // Section 3

  yield* inSubslice({until: pivot1},                   dualPivotQuicksort) // Section 1
  yield* inSubslice({from: pivot1 + 1, until: pivot2}, dualPivotQuicksort) // Section 2
  yield* inSubslice({from: pivot2 + 1},                dualPivotQuicksort) // Section 3

  yield* inSubslice({                  until: pivot1}, dualPivotQuicksort) // Section 1
  yield* inSubslice({from: pivot1 + 1, until: pivot2}, dualPivotQuicksort) // Section 2
  yield* inSubslice({from: pivot2 + 1,              }, dualPivotQuicksort) // Section 3

  yield* inSubslice([start, pivot1], function*() {
    return yield* dualPivotQuicksort() // Section 3
  })
  yield* inSubslice([pivot1 + 1, pivot2], function*() {
    return yield* dualPivotQuicksort() // Section 3
  })
  yield* inSubslice([pivot2 + 1, end], function*() {
    return yield* dualPivotQuicksort() // Section 3
  })
}
*/