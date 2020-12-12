import { State } from '../type'
import { createGlobalSystem } from './createSystem'

export const timeSystem = (state: State) =>
  createGlobalSystem({
    name: 'time',
    state,
    tick: ({ state }) => {
      return {
        ...state,
        time: {
          delta: state.time.timeNow - state.time.previousTimeNow,
          timeNow: state.time.timeNow,
          previousTimeNow: state.time.timeNow,
        },
      }
    },
  })
