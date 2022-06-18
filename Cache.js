class Cache {
  hits = 0
  misses = 0
  cacheAccesses = 0
  memAccesses = 0
}

/// A fully-associative cache simulator that uses a "least
/// recently used" eviction strategy.
class LruCache extends Cache {

  data = []

  // Assume maximum array size supported = 2^16 = 16,536 words.
  addrSizeBits = 16
  // Assume cache can only hold sqrt(2^16) = 2^8 = 256 words.
  cacheSizeBits = 8
  // Assume 2^5 = 32 words per cache line (aka memory block).
  cacheLineSizeBits = 5

  constructor(addrSizeBits, cacheSizeBits, cacheLineSizeBits) {
    super()
    
    this.addrSizeBits = addrSizeBits ?? this.addrSizeBits
    this.cacheSizeBits = cacheSizeBits ?? this.cacheSizeBits
    this.cacheLineSizeBits = cacheLineSizeBits ?? this.cacheLineSizeBits
    
    this.calculateSizes()
    this.initData()
  }

  // addr = [ *, *, *, *, *, *, *, *, *, *, *, *, *, *, *, * ]
  //        |<---------------tag------------>|<----offset--->|
  //                      (11 bits)               (5 bits)
  // Cache size = 2^8 = 256 words
  // Cache slot count = Cache size / Cache line size = 2^8 / 2^5 = 2^3 = 8 slots
  calculateSizes() {
    this.offsetBits = this.cacheLineSizeBits
    this.tagBits = this.addrSizeBits - this.offsetBits
    this.cacheSlotCountBits = this.cacheSizeBits - this.cacheLineSizeBits
  }

  initData() {
    this.data = Array(2 ** this.cacheSlotCountBits).fill().map((() => ({
      tag: undefined,
      offset: undefined,
      valid: false,
      dirty: false,
      timestamp: this.cacheAccesses,
    })))
  }

  findMatches(addr) {
    const tag = this.tag(addr)
    const offset = this.offset(addr)
    
    function slotMatch([idx, slot]) {
      return slot.valid && slot.tag === tag
    }
    
    return [...this.data.entries()].filter(slotMatch).map(([idx, _]) => idx)
  }

  load(addr) {
    this.cacheAccesses++

    const matches = this.findMatches(addr)
    
    if (matches.length > 0) {
      this.hits++
      const idx = matches[0]
      this.data[idx].timestamp = this.cacheAccesses
    } else {
      this.misses++
      const idx = this.findEvictable()
      const tag = this.tag(addr)
      const offset = this.offset(addr)
      this.memAccesses++ // Bring new data into cache.
      this.data[idx] = {
        tag,
        offset,
        valid: true,
        dirty: false, // <---
        timestamp: this.cacheAccesses
      }
    }
  }
  
  store(addr, value) {
    this.cacheAccesses++

    const matches = this.findMatches(addr)

    if (matches.length > 0) {
      this.hits++
      const idx = matches[0]
      this.data[idx].timestamp = this.cacheAccesses
      this.data[idx].dirty = true
    } else {
      this.misses++
      const idx = this.findEvictable()
      const tag = this.tag(addr)
      const offset = this.offset(addr)
      // Gotta bring in new cache line.
      this.memAccesses++
      this.data[idx] = {
        tag,
        offset,
        valid: true,
        dirty: true, // <---
        timestamp: this.cacheAccesses
      }
    }
  }

  tag(addr) {
    return (addr & nBitMask(16)) >> this.offsetBits
  }

  offset(addr) {
    return (addr & nBitMask(16)) & nBitMask(this.offsetBits)
  }

  findEvictable() {
        
    // The (L)east (R)ecently (U)sed slot.
    let lru = { idx: -1, timestamp: Infinity }
    
    for (const [idx, slot] of this.data.entries()) {
      // If there's an unused slot already, just use that one.
      if (!slot.valid) return idx
      else if (slot.timestamp < lru.timestamp) {
        lru = {idx, timestamp: slot.timestamp}
      }
    }

    // Writeback if the slot is dirty.
    if (this.data[lru.idx].valid && this.data[lru.idx].dirty)
      this.memAccesses++
    
    return lru.idx
  }

  test() {
    
    for (let i = 0; i < 32; i++) {
      this.load(i)
    }

    assertEq(this.hits, 31)
    assertEq(this.misses, 1)
    assertEq(this.cacheAccesses, 32)
    assertEq(this.memAccesses, 1)

    // Make everything dirty.
    for (let i = 0; i < 8; i++) {
      this.store(i * 32, 1234)
    }

    assertEq(this.hits, 32)
    assertEq(this.misses, 8)
    assertEq(this.cacheAccesses, 32 + 8)
    assertEq(this.memAccesses, 1 + 7)

    // Definitely not in the cache.
    this.load(100 * 32)

    assertEq(this.hits, 32)
    assertEq(this.misses, 8 + 1)
    assertEq(this.cacheAccesses, 32 + 8 + 1)
    assertEq(this.memAccesses, 1 + 7 + 2)
    
    console.log("LruCache tests passed!")
  }

  static test() {
    new LruCache().test()
  }
}

function nBitMask(n) {
  return (1 << (n + 1)) - 1
}

LruCache.test()