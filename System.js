class System {}

// See: https://mechanical-sympathy.blogspot.com/2013/02/cpu-cache-flushing-fallacy.html
class SandyBridge2012EClassServer extends System {
  static processorSpeed = 3.0e9 // 3.0GHz = 3.0e9 cycles/second
  static instrsPerCycle = 4
  static memHeir = [
    {
      name: "L1 Data Cache",
      sizeBits: 15, // 32Kib = 2^5 * 2^10 = 2^15 bytes
      accessCycles: 3, // 3 cycles to access DL1 cache
    },
    {
      name: "L2 Cache",
      sizeBits: 18, // 256Kib = 2^8 * 2^10 = 2^18 bytes
      accessCycles: 12, // 12 cycles to access DL2 cache
    },
    {
      name: "L3 Cache",
      sizeBits: 23, // ~8Mib = 2^3 * 2^20 = 2^23 bytes
      accessCycles: 38, // ~38 cycles to access DL3 cache
    },
    {
      name: "Main Memory",
      sizeBits: 32, // ~8Mib = 2^3 * 2^20 = 2^23 bytes
      accessCycles: 195, // ~65ns * (1 second/1e9 ns) * (3e9 cycles/second) = 195 cycles to access main memory
    },
  ]

  static instrExeTime = (1 /* instr */) * (1 /* cycle */ / this.instrPerCycle /* instr */) * (1 /* second */ / this.processorSpeed /* cycles */)

  static estimateCycles({
    instrs,
    memHeirHitsMisses,
  }) {
    let cycles = 0.25 * instrs

    for (let level = 0; level < this.memHeir.length; level++) {
      const {name, sizeBits, accessCycles} = this.memHeir[level]
      const {hits, misses} = memHeirHitsMisses[level]
    }
  }
}