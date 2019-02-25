# local-lambda-invoke

Support a lambda calling another lambda for local use only.

[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![Greenkeeper badge](https://badges.greenkeeper.io/JamesKyburz/local-lambda-invoke.svg)](https://greenkeeper.io/)
[![build status](https://api.travis-ci.org/JamesKyburz/local-lambda-invoke.svg)](https://travis-ci.org/JamesKyburz/local-lambda-invoke)
[![downloads](https://img.shields.io/npm/dm/local-lambda-invoke.svg)](https://npmjs.org/package/local-lambda-invoke)

### usage

```javascript
const AWS = require('aws-sdk')
const localLambdaInvoke = require('local-lambda-invoke')(AWS)

AWS.Lambda[Symbol.for('localHandlers')] = {
  async 'test-lambda' (event, context) { }
}

const params = {
  FunctionName: 'test-lambda',
  Payload: JSON.stringify({ testing: true }),
  InvocationType: 'Event',
  LogType: 'None',
  Qualifier: '$LATEST'
}

const lambda = new AWS.Lambda()
lambda.invoke(params).promise().then(console.log, console.error)

```

# license

[Apache License, Version 2.0](LICENSE)
