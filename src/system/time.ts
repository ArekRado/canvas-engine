import { State } from '../type'

type Update = (params: { state: State; timeNow?: number }) => State
export const update: Update = ({ state, timeNow }) => {
  const now = timeNow ?? performance.now()

  return {
    ...state,
    time: {
      delta: now - state.time.timeNow,
      timeNow: now,
    },
  }
}
