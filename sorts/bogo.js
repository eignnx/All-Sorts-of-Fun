function* bogo() {
  const len = yield getLength()
  
  function* notSorted() {
    for (let idx = start; idx < len - 1; idx++) {
      if (yield gt(load(idx), load(idx+1))) { // arr[idx] > arr[idx+1]
        return false
      }
    }
    return true
  }

  function* randomize() {
    for (let boundary = start; boundary < len; boundary++) {
      const randomIdx = Math.floor(Math.random() * (len - boundary) + boundary)
      yield swap(boundary, randomIdx)
    }
  }

  
  while (yield* notSorted()) {
    yield showFrame()
    yield* randomize()
  }
}