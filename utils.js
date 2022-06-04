
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