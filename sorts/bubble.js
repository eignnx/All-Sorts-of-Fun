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
        checkAgain = true
        yield {"rgb(224,11,11)": [i, i-1] }
      } else {
        yield {"rgb(165,165,217)": [i]}
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
          checkAgain = true
          yield {"rgb(224,11,11)": [i, i-1] }
        } else {
          yield {"rgb(165,165,217)": [i]}
        }
      }
      lastSortedIdx--
    } 
  }