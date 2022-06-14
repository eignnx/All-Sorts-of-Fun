function* classicPartition(arr, start, end, pivotIdx) {
  const pivot = yield load(pivotIdx)
  
  yield swap(start, pivotIdx).thenShowFrame()
  
  const tmpPivotIdx = start
  
  let poor = start + 1
  let rich = end - 1
  
  while (poor < rich) {
    if (yield lte(load(poor), pivot)) {
      poor++
      yield showFrame(new Bound(poor), new Bound(rich), new Pivot(tmpPivotIdx))
    } else if (yield gt(load(rich), pivot)) {
      rich--
      yield showFrame(new Bound(poor), new Bound(rich), new Pivot(tmpPivotIdx))
    } else {
      yield swap(poor, rich).thenShowFrame(new Pivot(tmpPivotIdx))
      poor++
      rich--
    }
  }
  
  let finalPivotIdx
  
  if (poor > rich) {
    finalPivotIdx = rich
  } else { // poor === rich
    if (yield lte(load(poor), pivot)) {
      finalPivotIdx = poor
    } else {
      finalPivotIdx = poor - 1
    }
  }
  
  yield swap(tmpPivotIdx, finalPivotIdx).thenShowFrame()
  
  return finalPivotIdx
}

function quicksort(selectPivot, partition=classicPartition) {
  
  function* qs(arr, start=0, end=arr.length) {
    if (end-start <= 1) return
    const pivotIdx = yield* selectPivot(arr, start, end)
    yield showFrame(new Pivot(pivotIdx))
    const newPivotIdx = yield* partition(arr, start, end, pivotIdx)
    yield showFrame(new Pivot(newPivotIdx))
    yield* qs(arr, start, newPivotIdx)
    yield* qs(arr, newPivotIdx+1, end)
  }
  
  return qs
}

function* pseudomedian(arr, start=0, end=arr.length) {
  const len = end - start
  if (len < 3) return start
  
  const w = Math.ceil(len / 2) // window width
  
  let winMin  = {value: yield load(start), idx: start}
  let winMax = {value: yield load(start), idx: start}
  
  for (let idx = start + 1; idx < w; idx++) {
    yield showFrame(new Window(start, idx))
    const value = yield load(idx)
    if (yield lt(value, winMin.value)) {
      winMin = {value, idx}
    }
    if (yield gt(value, winMax.value)) {
      winMax = {value, idx}
    }
  }

  let biggestMin = {...winMin}
  let smallestMax = {...winMax}
  
  for (let idx = start + w; idx < end; idx++) {
    const newest = yield load(idx)
    
    if (yield gt(newest, winMax.value)) {
      winMax = {value: newest, idx}
      if (yield lt(winMax.value, smallestMax.value)) {
        smallestMax = {...winMax}
      }
    }
    
    if (yield lt(newest, winMin.value)) {
      winMin = {value: newest, idx}
      if (yield lt(winMin.value, biggestMin.value)) {
        biggestMin = {...winMin}
      }
    }
    
    yield showFrame(new Window(idx-w, idx))
  }
  
  const pseudomed = (biggestMin.value + smallestMax.value) / 2
  
  function* getDiff(idx) {
    const value = yield load(idx)
    return Math.abs(pseudomed - value)
  }
  
  let closest = {diff: yield* getDiff(start), idx: start}
  
  for (let idx = start + 1; idx < end; idx++) {
    const diff = yield* getDiff(idx)
    if (yield lte(diff, closest.diff)) {
      closest = {diff, idx}
    }
    
    yield showFrame(new Scan(idx), new Min(closest.idx))
  }
  
  return closest.idx
}


function* medianOfThree(arr, start, end) {
  if (end-start < 3) return start
  
  const mid = Math.floor((start + end-1) / 2)

  const v1 = yield load(start)
  const v2 = yield load(mid)
  const v3 = yield load(end - 1)
  
  yield showFrame(...[start, mid, end-1].map(i => new Scan(i)))
  
  // `v1` is median
  if ((yield gte(v1, v2)) && (yield lte(v1, v3))
   || (yield gte(v1, v3)) && (yield lte(v1, v2)))
    return start
  
  // `v2` is median
  if ((yield gte(v2, v1)) && (yield lte(v2, v3))
   || (yield gte(v2, v3)) && (yield lte(v2, v1)))
    return mid
  
  // `v3` is median
  // if (v3 >= v2 && v3 <= v1 ||
  //     v3 >= v1 && v3 <= v2)
  else
    return end-1
}

function steppedSortMedian(mkSteppedSort, stepSizeFn = len => 3) {
  return function*(arr, start, end) {
    const len = end - start
    const step = Math.floor(stepSizeFn(len))
    const steps = Math.floor(len / step)

    const scans = [...Array.from(steps)]
      .map(idx => idx * step + start)
      .map(idx => new Scan(idx))

    yield* mapYielded(
      mkSteppedSort(step)(arr, start, end),
      cmd => (cmd instanceof ShowFrame) ? showFrame(cmd, ...scans) : cmd
    )

    const middleStepIdx = Math.floor(steps / 2)
    return step * middleStepIdx + start
  }
}

const pivotSelects = {
  simple: function*(_arr, start, _end) {
    return start
  },

  medianOfThree,

  medianOfSqrtLenInsertion: steppedSortMedian(steppedInsertionSort, Math.sqrt),
  medianOfSqrtLenShell: gapSeq => steppedSortMedian(steppedShellSort(gapSeq), Math.sqrt),
  
  pseudomedian,

  random: function*(_arr, start, end) {
    return Math.floor((end - start) * Math.random()) + start
  },

  Levimedian: function* (arr, start, end) {
    let sum = 0
    
    for (let idx = start; idx < end; idx++) {
      sum += yield load(idx)
      
      yield showFrame(new Scan(idx))
    }

    let mean = sum/(end - start)
    let median = {value: yield load(start), idx: start}
    
    for (let idx = start; idx < end; idx++) {
      const value = yield load(idx)
      if (Math.abs(value - mean) < Math.abs(median.value - mean)) {
        median = {value, idx}
      }
      
      yield showFrame(new Scan(idx), new Min(median.idx))
    }

    return median.idx
  },

}

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