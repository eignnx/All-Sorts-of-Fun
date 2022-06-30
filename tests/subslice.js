try {
  const a0 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14].subslice()
  assertEq(a0[5], 5)
  assertEq(a0[-1], 14)
  const a1 = a0.subslice({from: 1, step: 2}) // [1,3,5,7,9,11,13]
  assertEq(a1[2], 5)
  assertEq(a1[-1], 13)
  const a2 = a1.subslice({from: 2, step: 3}) // [5,11]
  assertEq(a2[0], 5)
  assertEq(a2[1], 11)
  
  console.info("Basic subslice tests passed!")
} catch (e) {
  console.error(e)
}

try {
  const arr = [0,1,2,3,4,5,6,7,8] // subslice = [2,5,8]
  const {start, end, step} = interpretRange({from: 2, step: 3}, arr.length)
  assertEq(start, 2)
  assertEq(end, arr.length)
  assertEq(step, 3)

  console.info("interpretRange tests passed!")
} catch (e) {
  console.error(e)
}

try {
  const arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14] // subslice = [2,5,8,11,14]
  
  const coro = inSubslice({from: 2, step: 3}, function*() {
    for (let i = 0; i < (yield getLength()); i++) {
      yield store(i, 999)
    }

    yield* inSubslice({from: 1, step: 2}, function*() { // subslice = [5,11]
      for (let i = 0; i < (yield getLength()); i++) {
        yield store(i, 777)
      }
    })

    yield* inSubslice({from: 2, step: 2}, function*() { // subslice = [8,14]
      for (let i = 0; i < (yield getLength()); i++) {
        yield store(i, 555)
      }
    })
    
  })
  
  const state = { arr, cache: new LruCache(), loads: 0, stores: 0, swaps: 0, colors: {} }
  let got = {done: false}
  let sendVal
  while (true) {
    got = coro.next(sendVal)
    if (got.done) break
    sendVal = got.value.apply(state)
  }
  
  assertEq(arr, [0,1,999,3,4,777,6,7,555,9,10,777,12,13,555].toString())
  
  console.info("inSubslice tests passed!")
} catch (e) {
  console.error(e)
}