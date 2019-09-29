import { vectorZero } from '../utils/vector'
import { createRigidbody } from './rigidbody'
import { createStore } from './store'

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
  setProperty: (dispatch, state) => payload => {
    dispatch({
      type: 'setProperty',
      payload: payload,
    })
  },
}

const gameObjectReducer = (state, action) => {
  switch (action.type) {
    case SET_GOAL_POSITION:
      return {
        ...state,
        goalPosition: action.payload,
      }
    default:
      return state
  }
}

export const createGameObject = params => app => {
  const tick = (go, app) => {
    params.tick && params.tick(go, app)
    go.rigidbody.tick(go, app)
    go.animations.forEach(animation => animation.tick(go, app, animation))

    go = Object.assign(go, go.store.getState())
    go.rigidbody = Object.assign(go.rigidbody, go.rigidbody.getState())
    go.animations = go.animations.reduce(
      (animations, animation) =>
        animations.concat(Object.assign(animation, animation.getState())),
      [],
    )

    return go
  }

  const store = createStore(
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
    ...store.actions,

    id: params.id || `${Math.random()}`,
    tick,
    animations: params.animations || [],
    beforeDestroy: params.beforeDestroy || v,
    store: store,
    image: createImage(params.image),
    rigidbody: createRigidbody(params.rigidbody),
  }

  params.afterCreate && params.afterCreate(() => go, app)

  return go
}
