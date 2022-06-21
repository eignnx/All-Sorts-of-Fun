const INIT_METHODS = N => ({
  "true random": () => Math.random(),
  "random^2": () => { const x = Math.random(); return x * x },
  "perlin noise": () => perlinNoise(),
  "sorted": i => i/N,
  "nearly sorted": i => i/N + 10 * (Math.random() - 0.5) / N,
  "reversed": i => 1 - i/N,
  "middle peak": i => 1 - 2 * Math.abs(i - N/2)/N
})

let ticks = 0
function perlinNoise() {
  ticks++
  return p.noise(ticks * perlinNoiseScale)
}
