
//        A@0
//   B@1       C@2
// D@3 E@4   F@5 G@6
//
//  0  1  2  3  4  5  6
// [A, B, C, D, E, F, G]

// Assume Max Heap for now
class Heap {

  constructor(size) {
    this.size = size
  }

  *heapify() {
    const last = this.size - 1
    for (let i = last; i >= 0; i--) {
      yield* this.#percolateDown(i)
    }
  }

  nonempty() {
    return this.size > 0
  }

  *swapRemoveTop() {
    yield swap(0, this.size - 1).thenShowFrame()
    this.size--
    yield* this.#percolateDown(0)
  }

  *#percolateDown(root) {
    if (root >= this.size) return
    const {left, right} = this.#children(root)
    const rootVal  = yield load(root)
    if (left < this.size && right < this.size) {
      const leftVal  = yield load(left)
      const rightVal = yield load(right)
      if (yield gt(leftVal, rightVal)) {
        if (yield gt(leftVal, rootVal)) {
          yield swap(left, root).thenShowFrame()
          yield* this.#percolateDown(left)
        }
      } else {
        if (yield gt(rightVal, rootVal)) {
          yield swap(right, root).thenShowFrame()
          yield* this.#percolateDown(right)
        }
      }
    } else if (left < this.size) {
      const leftVal  = yield load(left)
      if (yield gt(leftVal, rootVal)) {
        yield swap(left, root).thenShowFrame()
        yield* this.#percolateDown(left)
      }
    } else if (right < this.size) {
      const rightVal = yield load(right)
      if (yield gt(rightVal, rootVal)) {
        yield swap(right, root).thenShowFrame()
        yield* this.#percolateDown(right)
      }
    }
  }

  #children(parent) {
    const left  = 2 * parent + 1
    const right = 2 * parent + 2
    return {left, right}
  }
  
  #parent(child) {
    return Math.floor((child - 1) / 2)
  }
}

function* heapsort() {
  const h = new Heap(yield getLength())
  yield* h.heapify()
  while (h.nonempty()) {
    yield* h.swapRemoveTop()
  }
}