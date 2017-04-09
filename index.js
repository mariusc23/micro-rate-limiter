const LRU = require('lru-cache')
const { RateLimiter } = require('limiter')
const proxyaddr = require('proxy-addr')

const cache = LRU({
  max: 15000,
})

const rateLimit = (maxTokens, period) => next => (req, res) => {
  const ip = proxyaddr(req, ['loopback', 'linklocal', 'uniquelocal'])
  const limiter = cache.get(ip) || new RateLimiter(maxTokens, period, true)
  const hasMoreTokens = limiter.tryRemoveTokens(1)
  cache.set(ip, limiter)
  if (hasMoreTokens === false) {
    const error = new Error('Too Many Requests')
    error.statusCode = 429
    throw error
  }
  return next(req, res)
}

module.exports = {
  cache,
  rateLimit,
}
