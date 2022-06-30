function* pseudomedian() {
  const len = yield getLength()
  if (len < 3) return 0
  
  const w = Math.ceil(len / 2) // window width
  
  let winMin  = {value: yield load(start), idx: 0}
  let winMax = {value: yield load(start), idx: 0}
  
  for (let idx = 1; idx < w; idx++) {
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
  
  for (let idx = w; idx < len; idx++) {
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
  
  let closest = {diff: yield* getDiff(0), idx: 0}
  
  for (let idx = 1; idx < len; idx++) {
    const diff = yield* getDiff(idx)
    if (yield lte(diff, closest.diff)) {
      closest = {diff, idx}
    }
    
    yield showFrame(new Scan(idx), new Min(closest.idx))
  }
  
  return closest.idx
}

function* medianOfThree() {
  const len = yield getLength()
  if (len < 3) return 0
  
  const mid = Math.floor(len / 2)

  const v1 = yield load(0)
  const v2 = yield load(mid)
  const v3 = yield load(len - 1)
  
  yield showFrame(...[0, mid, len-1].map(i => new Scan(i)))
  
  // `v1` is median
  if ((yield gte(v1, v2)) && (yield lte(v1, v3))
   || (yield gte(v1, v3)) && (yield lte(v1, v2)))
    return 0
  
  // `v2` is median
  if ((yield gte(v2, v1)) && (yield lte(v2, v3))
   || (yield gte(v2, v3)) && (yield lte(v2, v1)))
    return mid
  
  // `v3` is median
  // if (v3 >= v2 && v3 <= v1 ||
  //     v3 >= v1 && v3 <= v2)
  else
    return len-1
}

function steppedSortMedian(sort, stepSizeFn = len => 3) {
  return function*() {
    const len = yield getLength()
    const step = Math.floor(stepSizeFn(len))
    const steps = Math.floor(len / step)

    const scans = [...Array.from(steps)]
      .map(idx => idx * step + start)
      .map(idx => new Scan(idx))

    yield* mapYielded(
      sort.inSubslice({step}),
      cmd => (cmd instanceof ShowFrame) ? showFrame(cmd, ...scans) : cmd
    )

    const middleStepIdx = Math.floor(steps / 2)
    return step * middleStepIdx
  }
}

const pivotSelects = {
  simple: function*() { return 0 },

  medianOfThree,

  medianOfSqrtLenInsertion: steppedSortMedian(insertionSort, Math.sqrt),
  medianOfSqrtLenShell: gapSeq => steppedSortMedian(shellSort(gapSeq), Math.sqrt),
  
  pseudomedian,

  random: function*() {
    return Math.floor((yield getLength()) * Math.random())
  },

  Levimedian: function*() {
    const len = yield getLength()
    let sum = 0
    
    for (let idx = 0; idx < len; idx++) {
      sum += yield load(idx)
      
      yield showFrame(new Scan(idx))
    }

    let mean = sum / len
    let median = {value: yield load(0), idx: 0}
    
    for (let idx = 0; idx < len; idx++) {
      const value = yield load(idx)
      if (Math.abs(value - mean) < Math.abs(median.value - mean)) {
        median = {value, idx}
      }
      
      yield showFrame(new Scan(idx), new Min(median.idx))
    }

    return median.idx
  },

}
