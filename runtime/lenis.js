const CDN_URL = 'https://cdn.jsdelivr.net/npm/lenis@1.3.11/dist/lenis.mjs'
const CDN_TIMEOUT = 2500

function timeoutPromise(milliseconds) {
  return new Promise((_, reject) => {
    window.setTimeout(() => reject(new Error('Lenis CDN timeout')), milliseconds)
  })
}

let Lenis = null

try {
  const module = await Promise.race([import(CDN_URL), timeoutPromise(CDN_TIMEOUT)])
  Lenis = module.default ?? module.Lenis ?? null
} catch (error) {
  try {
    const module = await import('../vendor/lenis.mjs')
    Lenis = module.default ?? module.Lenis ?? null
  } catch (fallbackError) {
    console.warn('[portfolio] Lenis CDN 与本地副本均不可用，使用原生滚动。', fallbackError)
  }
}

export default Lenis
