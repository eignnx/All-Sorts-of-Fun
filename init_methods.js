const INIT_METHODS = {
  "true random": () => random(0, 1),
  "perlin noise": () => perlinNoise(),
  "sorted": i => i/N,
  "nearly sorted": i => i/N + 5 * random(-1/N, 1/N),
  "reversed": i => 1 - i/N,
  "middle peak": i => 1 - 2*abs(i - N/2)/N
}

let ticks = 0
function perlinNoise() {
  ticks++
  return noise(ticks * PERLIN_NOISE_SCALE)
}
