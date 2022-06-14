function insertionSort(arr, start, end) {
  // function* insertionSort(arr, start=0, end=arr.length) {
  //   for (let sortedEnd = start; sortedEnd < end; sortedEnd++) {
  //     yield showFrame(new Bound(sortedEnd))
  //     for (let idx = sortedEnd; idx > start; idx--) {
  //       if (yield gt(yield load(idx - 1), yield load(idx))) {
  //         yield swap(idx-1, idx)
  //       } else {
  //         yield showFrame(new Scan(idx-1), new Scan(idx))
  //         break
  //       }
  //     }
  //   }
  // }
  return steppedInsertionSort(1)(arr, start, end)
}

function genTakeWhile(g, predicate) {
  let vs = []
  while (true) {
    const {done, value} = g.next()
    if (done || !predicate(value)) return vs
    vs.push(value)
  }
}

// See https://oeis.org/A102549
function* optimalGapSeq() {
  yield* [1, 4, 10, 23, 57, 132, 301, 701, 1750]
  let a = 1750
  while (true) {
    a = Math.floor(2.25 * a)
    yield a
  }
}

function* tokudaGapSeq() {
  let a = 1
  while (true) {
    yield Math.ceil(a)
    a = 2.25 * a + 1
  }
}

/// If gap = 2 and step = 4:
/// [x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, xA, xB, xC, xD, xE, xF]
/// [x0,             x4,             x8,             xC] == subarray (since step = 4)
/// [x0,                             x8] will be insertion-sorted in this pass (since gap = 2)
function gappedSteppedSortPass(gap, step=1) {
  return function*(arr, start=0, end=arr.length) {
    const stride = gap * step
    for (let sortedEnd = start + stride; sortedEnd < end; sortedEnd += step) {
      for (let idx = sortedEnd; idx - stride >= start; idx -= stride) {
        if (yield gt(load(idx - stride), load(idx))) {
          yield swap(idx - stride, idx).thenShowFrame()
        } else {
          yield showFrame(new Scan(idx - stride), new Scan(idx))
          break
        }
      }
      yield showFrame(new Bound(sortedEnd))
    }
  }
}

function steppedInsertionSort(step) {
  
  function* gapSeq() {
    yield 1 // Since gap == 1, this is regular insertion sort.
  }
  
  return steppedShellSort(gapSeq)(step)
}

function steppedShellSort(gapSeq) {
  return function(step) {
    return function*(arr, start=0, end=arr.length) {
      const len = Math.floor((end - start) / step)
      // const len = Math.floor((yield getlength()) / step)
      const gaps = genTakeWhile(gapSeq(), x => x < len).reverse()
      for (const gap of gaps) {
        const sortPass = gappedSteppedSortPass(gap, step)
        yield* sortPass(arr, start, end)
      }
    }
  }
}

function shellSort(gapSeq) {
  return steppedShellSort(gapSeq)(1)
}