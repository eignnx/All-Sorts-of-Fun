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
