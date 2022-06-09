function* insertionSort(arr, start=0, end=arr.length) {
  for (let sortedEnd = start; sortedEnd < end; sortedEnd++) {
    yield [new Bound(sortedEnd)]
    for (let idx = sortedEnd; idx > start; idx--) {
      if (arr[idx - 1] > arr[idx]) {
        arr.swap(idx-1, idx)
        yield [new Swap(idx-1, idx)]
      } else {
        yield [new Scan(idx-1), new Scan(idx)]
        break
      }
    }
  }
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
}

function* tokudaGapSeq() {
  let a = 1
  while (true) {
    yield Math.ceil(a)
    a = 2.25 * a + 1
  }
}

function shellSort(gapSeq) {
  
  return function*(arr, start=0, end=arr.length) {
    const gaps = genTakeWhile(gapSeq(), x => x < end-start).reverse()  
    for (const gap of gaps) {
      for (let sortedEnd = start + gap; sortedEnd < end; sortedEnd++) {
        yield [new Bound(sortedEnd)]
        for (let idx = sortedEnd; idx > start; idx -= gap) {
          if (arr[idx - gap] > arr[idx]) {
            arr.swap(idx-gap, idx)
            yield [new Swap(idx-gap, idx)]
          } else {
            yield [new Scan(idx-gap), new Scan(idx)]
            break
          }
        }
      }
    }
  }
}