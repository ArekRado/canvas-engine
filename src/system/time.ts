import { State } from '../type'
import { createSystem } from './createSystem'

export const timeSystem = (state: State) =>
  createSystem({
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
