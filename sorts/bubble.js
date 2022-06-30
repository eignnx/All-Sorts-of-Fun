function* basicBubble() {
  const len = yield getLength()
  
  if (len < 2) return
  
  let checkAgain = true
  
  while (checkAgain) {
    checkAgain = false
    for (let i = 1; i < len; i++) {
      if (yield gt(yield load(i-1), yield load(i))) {
        yield swap(i-1, i)
        checkAgain = true
        yield showFrame()
      } else {
        yield showFrame(new Scan(i))
      }
    }
  } 
}

function* betterBubble() {
  const len = yield getLength()
  
  if (len < 2) return
  
  let lastSortedIdx = len; 
  let checkAgain = true

  while (checkAgain) {
    checkAgain = false
    for (let i = 1; i < lastSortedIdx; i++) {
      if (yield gt(yield load(i-1), yield load(i))) {
        yield swap(i-1, i)
        checkAgain = true
        yield showFrame(new Bound(lastSortedIdx))
      } else {
        yield showFrame(new Scan(i), new Bound(lastSortedIdx))
      }
    }
    lastSortedIdx--
  }
}
