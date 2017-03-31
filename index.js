const LRU = require('lru-cache')
const { RateLimiter } = require('limiter')
const proxyaddr = require('proxy-addr')

const cache = LRU({
  max: 15000,
})

const rateLimit = (maxTokens, period) => next => async (req, res) => {
  const ip = proxyaddr(req, ['loopback', 'linklocal', 'uniquelocal'])
  const limiter = cache.get(ip) || new RateLimiter(maxTokens, period, true)
  return new Promise((resolve, reject) => {
    limiter.removeTokens(1, (err, remainingTokens) => {
      cache.set(ip, limiter)
      if (err || remainingTokens === -1) {
        const error = new Error('Too Many Requests')
        error.statusCode = 429
        return reject(error)
      }
      return resolve(next(req, res))
    })
  })
}

module.exports = {
  cache,
  rateLimit,
}
