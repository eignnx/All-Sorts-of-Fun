function completeCoro(coro) {
  while (true) {
    let {done, value} = coro.next()
    if (done) return value
  }
}

function* mapYielded(coro, fn) {
  let nextSendValue = undefined
  while (true) {
    const {value, done} = coro.next(nextSendValue)
    if (done) return value
    nextSendValue = yield fn(value)
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

Object.getPrototypeOf(function*(){}).thenDoPass = function(secondGeneratorFn) {
  const firstGeneratorFn = this
  return function*(...args) {
    yield* firstGeneratorFn(...args)
    return yield* secondGeneratorFn(...args)
  }
}

function pascalToCamel(str) {
	return str[0].toLowerCase() + str.slice(1)
}

/// Wrap a class definition to create a lowercased fn that
/// constructs the class.
/// Ex:
///   NewlessCtor(class BlahBlah {...})
///   blahBlah() === new BlahBlah()
function NewlessCtor(Class) {
  window[Class.name] = Class
	window[pascalToCamel(Class.name)] = (...args) => new Class(...args)
}

function sliceObject(o, ks) {
  return Object.fromEntries(ks.map(k => [k, o[k]]))
}

function setOrDefault(obj, key, default_, mapper) {
  if (!(key in obj)) obj[key] = default_
  mapper(obj[key])
}

// Based on: https://stackoverflow.com/a/65239086/9045161
String.prototype.simpleHashCode = function() {
  let hash = 0
  
  for (let i = 0; i < this.length; i++) {
    hash = Math.imul(31, hash) + this.charCodeAt(i)
  }

  return hash | 0
}

Object.isEmpty = o => {
  return Object.keys(o).length === 0
}

function assertEq(actual, expected) {
  if (actual !== expected) {
    throw new Error(`Assertion Failure: Expected ${expected}, got ${actual}`)
  }
}

// Valid formats for `range`:
//   [start, end] // Step is always 1 when array is provided.
//   {from, until, step} // All three of these are optional.
//   {}             <=> {from: 0,          until: length, step: 1}
//   [-3, Infinity] <=> {from: length - 3, until: length, step: 1}
function interpretRange(range, len) {
  let start, end, step

  if (range instanceof Array) {
    if (range.length !== 2) throw new Error("range must have exactly 2 elements")
    start = range[0]
    end   = range[1]
    step  = 1
  } else if (range instanceof Object) {
    start = range.from  ?? range.start  ?? 0
    end   = range.until ?? range.end    ?? len ?? (()=>{throw new Error("length must be provided in this case")})()
    step  = range.step  ?? range.stepBy ?? 1
  } else {
    throw new Error("bad range")
  }

  if (start < 0) start += len
  if (end < 0) end += len
  if (end === Infinity) end = len

  if (start < 0) throw new Error("Range out of bounds: start is less than 0")
  if (end > len) throw new Error("Range out of bounds: end is greater than slice length")
  if (step < 1)  throw new Error("Bad range: step is less than 1")

  return {start, end, step}
}

Array.prototype.subslice = function(range={}) {
  const {start, end, step} = interpretRange(range, this.length)

  return new Proxy(this, {
    get(underlying, prop, receiver) {
      if (prop === "length") {
        return Math.floor((end - start) / step)
      }

      if (typeof prop === "string" && !Number.isNaN(parseInt(prop))) {
        let relIdx = parseInt(prop)
        if (relIdx < 0) relIdx += receiver.length
        const idx = step * relIdx + start
        if (idx >= underlying.length) throw new Error(`Index out of bounds: ${relIdx} >= ${receiver.length}`)
        return underlying[idx]
      }
      
      if (prop === Symbol.iterator) {
      	return function*() {
        	for (let i = 0; i < receiver.length; i++) {
          	yield receiver[i]
          }
        }
      }
      
      if (prop === "toString") {
      	return () => {
        	return [...receiver].toString()
        }
      }

      return underlying[prop]
    },

    set(underlying, prop, value, receiver) {
      if (typeof prop === "string" && !Number.isNaN(parseInt(prop))) {
        const relIdx = parseInt(prop)
        const idx = step * relIdx + start
        if (idx >= underlying.length) throw new Error(`Index out of bounds: ${relIdx} >= ${receiver.length}`)
        underlying[idx] = value
      } else {
        underlying[prop] = value
      }
      return true
    }
  })
}

// Tests:
const a0 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14].subslice()
assertEq(a0[5], 5)
assertEq(a0[-1], 14)
const a1 = a0.subslice({from: 1, step: 2}) // [1,3,5,7,9,11,13]
assertEq(a1[2], 5)
assertEq(a1[-1], 13)
const a2 = a1.subslice({from: 2, step: 3}) // [5,11]
assertEq(a2[0], 5)
assertEq(a2[1], 11)

console.info("subslice tests passed!")