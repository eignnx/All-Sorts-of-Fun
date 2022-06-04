function* pseudomedian(arr, start=0, end=arr.length) {
  const len = end - start
  if (len < 3) return start
  
  const w = Math.ceil(len / 2) // window width
  
  let winMin  = {value: arr[start], idx: start}
  let winMax = {value: arr[start], idx: start}
  
  for (let idx = start + 1; idx < w; idx++) {
    const value = arr[idx]
    if (value < winMin.value) {
      winMin = {value, idx}
    }
    if (value > winMax.value) {
      winMax = {value, idx}
    }
  }

  let biggestMin = {...winMin}
  let smallestMax = {...winMax}
  
  for (let idx = start + w; idx < end; idx++) {
    const newest = arr[idx]
    
    if (newest > winMax.value) {
      winMax = {value: newest, idx}
      if (winMax.value < smallestMax.value) {
        smallestMax = {...winMax}
      }
    }
    
    if (newest < winMin.value) {
      winMin = {value: newest, idx}
      if (winMin.value < biggestMin.value) {
        biggestMin = {...winMin}
      }
    }
    
    yield {"yellow": [idx - w, idx]}
  }
  
  const pseudomed = (biggestMin.value + smallestMax.value) / 2
  const getDiff = idx => abs(pseudomed - arr[idx])
  
  let closest = {diff: getDiff(start), idx: start}
  
  for (let idx = start + 1; idx < end; idx++) {
    const diff = getDiff(idx)
    if (diff <= closest.diff) {
      closest = {diff, idx}
    }
    
    yield {"yellow": [idx], "orange": [closest.idx]}
  }
  
  return closest.idx
}

const pivotSelects = {
  simple: function*(arr, start, end) {
    return start
  },

  medianOfThree: function* (arr, start, end) {
    if (end-start < 3) return start
    return yield* medianOfThree(arr, start, end-1)
  },
  
  pseudomedian: pseudomedian,
}

function* medianOfThree(arr, first, last) {
  const mid = Math.floor((first + last) / 2)
  
  const [v1, v2, v3]  = [arr[first], arr[mid], arr[last]]
  
  yield {"yellow": [first, mid, last]}
  
  // `v1` is median
  if (v1 >= v2 && v1 <= v3 ||
      v1 >= v3 && v1 <= v2)
    return first
  
  // `v2` is median
  if (v2 >= v1 && v2 <= v3 ||
      v2 >= v3 && v2 <= v1)
    return mid
  
  // `v3` is median
  // if (v3 >= v2 && v3 <= v1 ||
  //     v3 >= v1 && v3 <= v2)
  else
    return last
}


const sorts = {
  
  "basic bubblesort": function*(arr) {
    const len = arr.length
    
    if (len < 2) {
      return arr
    }
    
    let checkAgain = true
    while (checkAgain) {
      checkAgain = false
      for (let i = 1; i < len; i++) {
        if (arr[i-1] > arr[i]) {
          arr.swap(i-1, i)
          checkAgain = true
          yield {"rgb(224,11,11)": [i, i-1] }
        } else {
          yield {"rgb(165,165,217)": [i]}
        }
        
        
      }
    } 
  },
  
  "better bubblesort": function*(arr) {
    const len = arr.length
    
    if (len < 2) {
      return arr
    }
    
    let lastSortedIdx = len; 
    let checkAgain = true
    while (checkAgain) {
      checkAgain = false
      for (let i = 1; i < lastSortedIdx; i++) {
        if (arr[i-1] > arr[i]) {
          arr.swap(i-1, i)
          checkAgain = true
          yield {"rgb(224,11,11)": [i, i-1] }
        } else {
          yield {"rgb(165,165,217)": [i]}
        }
      }
      lastSortedIdx--
    } 
  },
  
  "simple pivot quicksort": quicksort(pivotSelects.simple),
  
  "median of 3 quicksort": quicksort(pivotSelects.medianOfThree),
  
  "pseudomedian quicksort": quicksort(pivotSelects.pseudomedian),
 
  "quick mean sort": quickMeanSort,
}

function quicksort(selectPivot) {
  
  function* partition(arr, start, end, pivotIdx) {
    const pivot = arr[pivotIdx]
    
    arr.swap(start, pivotIdx)
    const tmpPivotIdx = start
    
    yield {"magenta": [start, pivotIdx]}
    
    let poor = start + 1
    let rich = end - 1
    
    while (poor < rich) {
      if (arr[poor] <= pivot) {
        poor++
        yield {"cyan": [poor-1, rich], "green": [tmpPivotIdx]}
      } else if (arr[rich] > pivot) {
        rich--
        yield {"cyan": [poor, rich+1], "green": [tmpPivotIdx]}
      } else {
        arr.swap(poor, rich)
        poor++
        rich--
        yield {"red": [poor, rich], "green": [tmpPivotIdx]}
      }
    }
    
    let finalPivotIdx
    
    if (poor > rich) {
      finalPivotIdx = rich
    } else { // poor === rich
      if (arr[poor] <= pivot) {
        finalPivotIdx = poor
      } else {
        finalPivotIdx = poor - 1
      }
    }
    
    arr.swap(tmpPivotIdx, finalPivotIdx)  
    yield {"magenta": [tmpPivotIdx, finalPivotIdx]}
    
    {
      const len = end - start
      const small = finalPivotIdx - start
      const large = len - small
      const score = 2 / (1 + exp(30 * sq(small/len - 0.5))) * (len / N)
      yield {score}
      console.log(
        `split score = ${nf(100 * score, 2, 2)} (${small}:${large})`
      )
    }
    
    return finalPivotIdx
  }
  
  function* qs(arr, start, end) {
    if (end-start < 2) return
    const pivotIdx = yield* selectPivot(arr, start, end)
    yield {"green": [pivotIdx]}
    const newPivotIdx = yield* partition(arr, start, end, pivotIdx)
    yield {"green": [newPivotIdx]}
    yield* qs(arr, start, newPivotIdx)
    yield* qs(arr, newPivotIdx+1, end)
  }
  
  return function*(arr) {
    yield* qs(arr, 0, arr.length)
  }
}

function quickMeanSort(arr) {
  
  function* meanPartition(arr, start, end, pivot) {
    
    let poor = start
    let rich = end - 1
    
    while (poor < rich) {
      if (arr[poor] <= pivot) {
        poor++
        yield {"cyan": [poor-1, rich]}
      } else if (arr[rich] > pivot) {
        rich--
        yield {"cyan": [poor, rich+1]}
      } else {
        arr.swap(poor, rich)
        poor++
        rich--
        yield {"red": [poor, rich]}
      }
    }
    
    if (poor === rich) {
      if (arr[poor] < pivot) {
        return poor + 1
      } else {
        return poor
      }
    } else { // poor > rich
      return poor
    }
  }
  
  function* qms(arr, start, end) {
    if (end - start < 2) return
    
    let lo, hi
    
    if (start === 0) lo = arr[start]
    else lo = arr[start - 1]
    
    if (end === arr.length) hi = arr[end - 1]
    else hi = arr[end]
    
    const mean = (lo + hi) / 2
    
    const mid = yield* meanPartition(arr, start, end, mean)
    yield* qms(arr, start, mid)
    yield* qms(arr, mid, end)
  }
  
  return qms(arr, 0, arr.length)
}

Array.prototype.swap = function(a, b) {
  aValue = this[a]
  bValue = this[b]
  
  this[a] = bValue
  this[b] = aValue
}

function completeCoro(coro) {
  while (true) {
    let {done, value} = coro.next()
    if (done) return value
  }
}