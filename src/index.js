module.exports = Lambda => {
  Lambda.prototype.invoke = function (params, cb) {
    const context = { getRemainingTimeInMillis: () => 60000 }
    const localHandlersKey = Symbol.for('localHandlers')
    if (typeof cb === 'function') {
      throw new TypeError(
        'callback invoke not supported, only invoke().promise supported'
      )
    }
    return {
      promise () {
        return new Promise((resolve, reject) => {
          process.nextTick(() => {
            if (params.InvocationType === 'Event') resolve()
            const handlers = Lambda[localHandlersKey]
            const fn = handlers && handlers[params.FunctionName]
            if (!fn) {
              return reject(
                new Error(
                  `unknown lambda function ${
                    params.FunctionName
                  }, need to register with registerLocal`
                )
              )
            }
            const payload = JSON.parse(params.Payload)
            if (fn.length === 3) {
              fn(
                payload,
                context,
                (err, data) => (err ? reject(err) : resolve(data))
              )
            } else {
              fn(payload, context).then(resolve, reject)
            }
          })
        })
      }
    }
  }
}
