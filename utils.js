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

