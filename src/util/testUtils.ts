import { AnyState, InternalInitialState } from '../type'
import { runOneFrame } from './runOneFrame'

export const tick = (
  state: InternalInitialState | AnyState,
) => {
  return runOneFrame({ state })
}
