import {
  add,
  normalize,
  scale,
  sub,
  vectorZero,
  distance,
} from '../utils/vector'
import { createGameObject } from '../engine/gameObject'
import human from '../assets/human.png'

export const SET_GOAL_POSITION = 'unit.SET_GOAL_POSITION'

const goToGoal = (go, app) => {
  const goalPosition = go.goalPosition
  if (goalPosition) {
    const dist = distance(go.rigidbody.position, goalPosition)
    if (dist > 1) {
      const shift = scale(
        app.gameObjects.time.delta * go.speed,
        normalize(sub(go.rigidbody.position, goalPosition)),
      )

      go.rigidbody.setPosition(sub(go.rigidbody.position, shift))
    } else if (dist !== 0) {
      go.rigidbody.setPosition(goalPosition)
    }
  }
}

export const unit = ({ id, goal, position, player } = {}) =>
  createGameObject({
    id,
    state: {
      speed: 0.05,
      goal,
      goalPosition: vectorZero(),
      player,
    },
    image: {
      url: human,
    },
    rigidbody: { position },
    tick: (go, app) => {
      goToGoal(go, app)
    },

    actions: {
      goTo: (dispatch, state) => payload => {
        dispatch({
          type: SET_GOAL_POSITION,
          payload: payload,
        })
      },
    },

    reducer: (state, action) => {
      switch (action.type) {
        case SET_GOAL_POSITION:
          return {
            ...state,
            goalPosition: action.payload,
          }
        default:
          return state
      }
    },
  })
