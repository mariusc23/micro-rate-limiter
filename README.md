# micro-rate-limiter

> Rate limit middleware for micro.

## Installation

    npm install --save @mariusc23/micro-rate-limiter

## Usage

```js
const { applyMiddleware } = require('@mariusc23/micro-middleware')
const { rateLimit } = require('@mariusc23/micro-rate-limiter')

const middleware = [
  rateLimit(150, 1000 * 60 * 60),
]

const handler = (req, res) => ('Hello word!')

module.exports = applyMiddleware(middleware, handler)
```

## License

Copyright (c) 2017 Marius Craciunoiu. Licensed under the MIT license.
