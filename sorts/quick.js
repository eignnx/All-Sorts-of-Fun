function* dualPivotPartition([pivotA, pivotB]) {
  const len = yield getLength()
  if (len < 2) throw new Error("array too small")
  
  const [pivotAVal, pivotBVal] = [yield load(pivotA), yield load(pivotB)]
  yield showFrame(new Pivot(pivotA), new Pivot(pivotB))
  
  let pivot1, pivot1Val
  let pivot2, pivot2Val

  if (yield lt(pivotAVal, pivotBVal)) {
    pivot1 = pivotA
    pivot2 = pivotB
    pivot1Val = pivotAVal
    pivot2Val = pivotBVal
  } else {
    // Pivots are out of order; swap them.
    pivot1 = pivotB
    pivot2 = pivotA
    pivot1Val = pivotBVal
    pivot2Val = pivotAVal
  }

  const tmpPivot1 = 0
  const tmpPivot2 = len - 1
  
  if (pivot1 === tmpPivot2 && pivot2 === tmpPivot1) {
    yield swap(pivot1, pivot2).thenShowFrame(new Pivot(tmpPivot1))
  } else {
    yield swap(tmpPivot1, pivot1).thenShowFrame(new Pivot(tmpPivot1))
    yield swap(tmpPivot2, pivot2).thenShowFrame(new Pivot(tmpPivot2))
  }

  let lo = tmpPivot1 + 1
  let hi = tmpPivot2 - 1

  for (let mid = lo; mid <= hi; mid++) {
    let midVal = yield load(mid)
    
    if (yield lt(midVal, pivot1Val)) {
      yield swap(lo, mid).thenShowFrame(new Bound(hi))
      lo++
    }
    else if (yield gte(midVal, pivot2Val)) {
      
      let hiVal = yield load(hi)
      while (mid < hi && (yield gt(hiVal, pivot2Val))) {
        hi--
        hiVal = yield load(hi)
      }
      
      yield swap(mid, hi).thenShowFrame(new Bound(lo))
      hi--

      midVal = hiVal
      
      if (yield lt(midVal, pivot1Val)) {
        yield swap(lo, mid).thenShowFrame(new Bound(hi))
        lo++
      }
    } else {
      yield showFrame(new Pivot(pivot1), new Pivot(pivot2))
    }
  }

  const finalPivot1 = lo - 1
  const finalPivot2 = hi + 1

  yield swap(tmpPivot1, finalPivot1).thenShowFrame()
  yield swap(tmpPivot2, finalPivot2).thenShowFrame()
  
  return [finalPivot1, finalPivot2]
}

function* dualPivotQuicksort() {
  const len = yield getLength()
  if (len < 2) return
  const [pivotA, pivotB] = [0, len - 1]
  const [pivot1, pivot2] = yield* dualPivotPartition([pivotA, pivotB])
  yield* dualPivotQuicksort.inSubslice({                  until: pivot1}) // Section 1
  yield* dualPivotQuicksort.inSubslice({from: pivot1 + 1, until: pivot2}) // Section 2
  yield* dualPivotQuicksort.inSubslice({from: pivot2 + 1               }) // Section 3
}

function presortAwarePartition(
  // A function which returns true if the value at the relative index provided has been presorted relative to the pivot.
  sliceIdxPresorted = len => idx => false, 
) {
  return function*(pivot) {
    const len = yield getLength()
    const idxPresorted = sliceIdxPresorted(len)
    
    const pivotVal = yield load(pivot)
    yield swap(0, pivot).thenShowFrame()
    const oldPivot = pivot
    const tmpPivot = 0
    
    let lo = 1
    let hi = len - 1
  
    function* loOnCorrectSideOfPivot() {
      if (idxPresorted(lo)) return lo <= oldPivot
      if (yield lte(load(lo), pivotVal)) return true // arr[lo] <= pivotVal
      else return false
    }
  
    function* hiOnCorrectSideOfPivot() {
      if (idxPresorted(hi)) return hi > oldPivot
      if (yield gt(load(hi), pivotVal)) return true // arr[hi] > pivotVal
      else return false
    }
    
    outer:
    while (lo < hi) {
  
      while (yield* loOnCorrectSideOfPivot()) {
        yield showFrame(new Bound(lo), new Bound(hi), new Pivot(tmpPivot))
        lo++
        if (lo >= hi) break outer
      }
  
      while (yield* hiOnCorrectSideOfPivot()) {
        yield showFrame(new Bound(lo), new Bound(hi), new Pivot(tmpPivot))
        hi--
        if (lo >= hi) break outer
      }
  
      yield swap(lo, hi).thenShowFrame(new Pivot(tmpPivot))
      lo++
      hi--
    }
    
    let finalPivot
  
    if (lo > hi) {
      finalPivot = hi
    } else if (yield* loOnCorrectSideOfPivot()) {
      finalPivot = lo
    } else {
      finalPivot = lo - 1
    }
    
    yield swap(tmpPivot, finalPivot).thenShowFrame()
    
    return finalPivot
  }
}

const classicPartition = presortAwarePartition()

function quicksort({
  selectPivot,
  partition = classicPartition,
  haltCriterion = len => (len < 2),
  postHaltAction = function*() {}
}) {
  if (selectPivot === undefined)
    throw new Error("A value for `selectPivot` must be provided to `quicksort`!")
  
  function* qs() {
    const len = yield getLength()
    
    if (haltCriterion(len)) {
      return yield* postHaltAction()
    }
    const pivotIdx = yield* selectPivot()
    yield showFrame(new Pivot(pivotIdx))
    const newPivotIdx = yield* partition(pivotIdx)
    yield showFrame(new Pivot(newPivotIdx))
    yield* qs.inSubslice({until: newPivotIdx})
    yield* qs.inSubslice({from: newPivotIdx + 1})
  }
  
  return qs
}

