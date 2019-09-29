const getIdGenerator = () => {
  let lastId = 0

  return () => {
    lastId += 1
    return lastId
  }
}

const subscriptions = {}
const getNextUniqueId = getIdGenerator()

export const subscribe = (eventType, callback) => {
  const id = getNextUniqueId()

  if (!subscriptions[eventType]) subscriptions[eventType] = {}

  subscriptions[eventType][id] = callback

  return {
    unsubscribe: () => {
      delete subscriptions[eventType][id]
      if (Object.keys(subscriptions[eventType]).length === 0)
        delete subscriptions[eventType]
    },
  }
}

export const emit = (eventType, arg) => {
  if (!subscriptions[eventType]) return

  Object.keys(subscriptions[eventType]).forEach(key =>
    subscriptions[eventType][key](arg),
  )
}
