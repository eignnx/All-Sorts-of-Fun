function* bogo(_arr, start=0, end=_arr.length) {
  
  function* notSorted() {
    for (let idx = start; idx < end - 1; idx++) {
      if (yield gt(load(idx), load(idx+1))) { // arr[idx] > arr[idx+1]
        return false
      }
    }
    return true
  }

  function* randomize() {
    for (let boundary = start; boundary < end; boundary++) {
      const randomIdx = Math.floor(Math.random() * (end - boundary) + boundary)
      yield swap(boundary, randomIdx)
    }
  }

  
  while (yield* notSorted()) {
    yield showFrame()
    yield* randomize()
  }
}