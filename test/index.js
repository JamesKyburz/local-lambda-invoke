const { test } = require('tap')
const AWS = require('aws-sdk')
const localLambdaInvoke = require('../')(AWS)

test('invoke with invocation type event', async t => {
  t.plan(3)
  AWS.Lambda[Symbol.for('localHandlers')] = {
    async 'test-lambda' (event, context) {
      t.ok(context.getRemainingTimeInMillis() > 0)
      t.equals(event.testing, 'test')
    }
  }

  const params = {
    FunctionName: 'test-lambda',
    Payload: JSON.stringify({ testing: 'test' }),
    InvocationType: 'Event',
    LogType: 'None',
    Qualifier: '$LATEST'
  }

  const lambda = new AWS.Lambda()
  const result = await lambda.invoke(params).promise()

  t.equals(result, undefined)
})

test('invoke with invocation type request response', async t => {
  t.plan(3)
  AWS.Lambda[Symbol.for('localHandlers')] = {
    async 'test-lambda' (event, context) {
      t.ok(context.getRemainingTimeInMillis() > 0)
      t.equals(event.testing, 'test')
      return {
        ok: true
      }
    }
  }

  const params = {
    FunctionName: 'test-lambda',
    Payload: JSON.stringify({ testing: 'test' }),
    InvocationType: 'RequestResponse',
    LogType: 'None',
    Qualifier: '$LATEST'
  }

  const lambda = new AWS.Lambda()
  const result = await lambda.invoke(params).promise()

  t.equals(result.ok, true)
})
