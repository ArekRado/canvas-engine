import { State } from '../type'
import { update as timeSystemUpdate } from '../system/time'
import { update as IOSystemUpdate } from '../system/io'

type RunOneFrame = (params: { state: State; timeNow?: number }) => State

export const runOneFrame: RunOneFrame = ({ state, timeNow }) => {
  const v1 = timeSystemUpdate({ state, timeNow })
  const v2 = IOSystemUpdate({ state: v1 })

  return Object.values(state.system).reduce(
    (acc, system) => system.tick({ state: acc }),
    v2,
  )
}
