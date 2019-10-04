import { vectorZero } from '../utils/vector'
import { createRigidbody } from './rigidbody'
import { createStore } from './store'
import { createAnimation } from './animation'

const createImage = ({
  url = '',
  position = vectorZero(),
  size = vectorZero(),
  rotation = 0,
  zIndex = 0,
  stickToRigidbody = true,
} = {}) => ({
  url,
  position,
  size,
  rotation,
  zIndex,
  stickToRigidbody,
})

const v = () => {}

const gameObjectActions = {
  setProperty: (key, value) => ({
    type: 'setProperty',
    payload: {
      key,
      value,
    },
  }),
}

const gameObjectReducer = (state, action) => {
  switch (action.type) {
    case 'setProperty':
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      }
    default:
      return state
  }
}

export const createGameObject = params => app => {
  const tick = (go, app) => {
    params.tick && params.tick(go, app)
    go.rigidbody.tick(go, app)
    // go.animations.forEach(animation => animation.tick(go, app, animation))

    go = Object.assign(go, go.getState())
    go.rigidbody = Object.assign(go.rigidbody, go.rigidbody.getState())

    go.animations = Object.entries(go.animations).reduce(
      (animations, [key, animation]) => {
        animation.tick(go, app, animation)

        return {
          ...animations,
          [key]: Object.assign(animation, animation.getState()),
        }
      },
      {},
    )

    return go
  }

  const { actions: bindedActions, getState } = createStore(
    params.reducer,
    params.state,
    {
      ...params.actions,
      ...gameObjectActions,
    },
    gameObjectReducer,
  )

  const go = {
    ...params,
    ...bindedActions,

    id: params.id || `${Math.random()}`,
    tick,
    animations: Object.entries(params.animations || {}).reduce(
      (animations, [key, animation]) => ({
        ...animations,
        [key]: createAnimation(animation),
      }),
      {},
    ),
    beforeDestroy: params.beforeDestroy || v,
    getState,
    image: createImage(params.image),
    rigidbody: createRigidbody(params.rigidbody),
  }

  params.afterCreate && params.afterCreate(() => go, app)

  return go
}
