function presortAwarePartition(
  // A function which returns true if the value at the relative index provided has been presorted relative to the pivot.
  sliceIdxPresorted = (start, end) => idx => false, 
) {
  return function*(arr, start, end, pivot) {
    const idxPresorted = sliceIdxPresorted(start, end)
    
    const pivotVal = yield load(pivot)
    yield swap(start, pivot).thenShowFrame()
    const oldPivot = pivot
    const tmpPivot = start
    
    let lo = start + 1
    let hi = end - 1
  
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
  haltCriterion = len => (len <= 1),
  postHaltAction = function*(arr, start, end) {}
}) {
  if (selectPivot === undefined)
    throw "A value for `selectPivot` must be provided to `quicksort`!"
  
  function* qs(arr, start=0, end=arr.length) {
    if (haltCriterion(end - start)) {
      return yield* postHaltAction(arr, start, end)
    }
    const pivotIdx = yield* selectPivot(arr, start, end)
    yield showFrame(new Pivot(pivotIdx))
    const newPivotIdx = yield* partition(arr, start, end, pivotIdx)
    yield showFrame(new Pivot(newPivotIdx))
    yield* qs(arr, start, newPivotIdx)
    yield* qs(arr, newPivotIdx+1, end)
  }
  
  return qs
}

