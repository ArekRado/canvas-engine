import { State } from '../type'

type RunOneFrame = (params: { state: State; timeNow?: number }) => State
export const runOneFrame: RunOneFrame = ({ state, timeNow }): State => {
  const v1: State = {
    ...state,
    time: {
      ...state.time,
      timeNow: timeNow !== undefined ? timeNow : performance.now(),
    },
  }

  return Object.values(state.system).reduce(
    (acc, system) => system.tick({ state: acc }),
    v1,
  )
}
