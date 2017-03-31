const { expect } = require('chai')
const sinon = require('sinon')
const { rateLimit } = require('../')

describe('rateLimit', () => {
  const next = sinon.spy()
  const req = {
    connection: {
      remoteAddress: '::1',
    },
    headers: {},
  }
  const res = {}

  afterEach(() => {
    next.reset()
  })

  it('should allow first request', async () => {
    const middleware = rateLimit(1, 10)
    const handler = middleware(next)
    await handler(req, res)
    expect(next.calledOnce).to.equal(true)
  })

  it('should deny second request', async () => {
    const middleware = rateLimit(1, 10)
    const handler = middleware(next)
    try {
      await handler(req, res)
    } catch (err) {
      expect(err.statusCode).to.equal(429)
      expect(err.message).to.equal('Too Many Requests')
      expect(next.calledOnce).to.equal(false)
    }
  })

  it('should allow third request after timeout', done => {
    setTimeout(async () => {
      const middleware = rateLimit(1, 10)
      const handler = middleware(next)
      await handler(req, res)
      expect(next.calledOnce).to.equal(true)
      done()
    }, 11)
  })
})
