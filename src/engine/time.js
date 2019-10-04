import { createGameObject } from './gameObject'

export const time = () =>
  createGameObject({
    id: 'time',
    state: {
      delta: 0,
      now: 0,
    },
    tick: gameObject => {
      const now = performance.now()
      gameObject.setTime({
        delta: now - gameObject.now,
        now,
      })
    },
    actions: {
      setTime: payload => ({
        type: 'setTime',
        payload,
      }),
    },
    reducer: (state, action) => {
      switch (action.type) {
        case 'setTime':
          return {
            ...state,
            delta: action.payload.delta,
            now: action.payload.now,
          }

        default:
          return state
      }
    },
  })
