function* insertionSort() {
  const len = yield getLength()
  const arr = yield unsafeGetArr()
  console.log("inseriton sort got:", [...arr])
  for (let sortBound = 1; sortBound < len; sortBound++) {
    const incoming = yield load(sortBound)
    yield showFrame(new Bound(sortBound))

    let i = sortBound
    while (i > 0) {
      const current = yield load(i - 1)
      if (yield lte(current, incoming)) break
      yield store(i, current).thenShowFrame()
      i--
    }
    yield store(i, incoming).thenShowFrame()
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

function shellSort(gapSeq) {
  return function*() {
    const len = yield getLength()
    const gaps = genTakeWhile(gapSeq(), x => x < len).reverse()
    for (const gap of gaps) {
/*
for (i = gap; i < n; i += 1) {
    # save a[i] in temp and make a hole at position i
    temp = a[i]
    # shift earlier gap-sorted elements up until the correct location for a[i] is found
    for (j = i; a[j - gap] > temp; j -= gap) {
        a[j] = a[j - gap]
    }
    # put temp (the original a[i]) in its correct location
    a[j] = temp
 }
*/
      for (let offset = 0; offset < gap; offset++) {
        console.log(`Gap: ${gap}, offset: ${offset}`)
        yield* insertionSort.inSubslice({from: offset, step: gap, until: len})
      }
    }
  }
}
