import { EmptyState } from '../type'
import { runOneFrame } from './runOneFrame'

export const tick = (state: EmptyState) => {
  return runOneFrame({ state })
}
