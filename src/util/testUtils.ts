import { InitialState } from '../type'
import { runOneFrame } from './runOneFrame'

export const tick = (state: InitialState) => {
  return runOneFrame({ state })
}
