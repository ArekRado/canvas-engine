import { time } from './time'
import { keyboard } from './keyboard'
import { mouse } from './mouse'
import { createDraw } from './draw'

const reducer = (app, action) => {
  switch (action.type) {
    case 'addGameObject':
      const newGameObject = action.payload
      return {
        ...app,
        gameObjects: {
          ...app.gameObjects,
          [newGameObject.id]: newGameObject,
        },
      }
    case 'destroyGameObject':
      const { [action.payload.id]: omit, ...rest } = app.gameObjects
      const gameObjects = rest

      return {
        ...app,
        gameObjects,
      }
    default:
      return app
  }
}

export const createApp = (options = {}) => {
  const draw = !!options.withDraw ? createDraw() : null

  let queuedActions = []
  let app = {}

  app = {
    gameObjects: {},
    tick: (debugMode = false) => {
      const newApp = queuedActions
        .map(action =>
          typeof action.payload === 'function'
            ? {
                type: action.type,
                payload: action.payload(app),
              }
            : action,
        )
        .reduce(reducer, app)

      queuedActions = []

      Object.keys(newApp.gameObjects).forEach(key => {
        let go = newApp.gameObjects[key]
        go.tick(go, newApp)

        // go.tick(go, newApp)
        // go.rigidbody.tick(go, newApp)

        // go = Object.assign(go, go.store.tick(go, newApp))
        // go.rigidbody = Object.assign(go.rigidbody, go.rigidbody.store.tick())
      })

      draw && draw(newApp, debugMode)

      app = newApp
      return newApp
    },
    addGameObject: payload => {
      const go = payload(() => app)
      queuedActions.push({
        type: 'addGameObject',
        payload: go,
      })

      return go
    },
  }

  app.addGameObject(time())
  app.addGameObject(mouse())
  app.addGameObject(keyboard())

  return app.tick()
}
