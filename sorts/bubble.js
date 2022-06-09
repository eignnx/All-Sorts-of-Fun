function* basicBubble(arr) {
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
        yield [new Swap(i-1, i)]
        checkAgain = true
      } else {
        yield [new Scan(i)]
      }
    }
  } 
}

function* betterBubble(arr) {
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
          yield [new Swap(i-1, i), new Bound(lastSortedIdx)]
          checkAgain = true
        } else {
        yield [new Scan(i), new Bound(lastSortedIdx)]
        }
      }
      lastSortedIdx--
    } 
  }