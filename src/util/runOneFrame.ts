import { AnyState } from '../type'

export const runOneFrame = <State extends AnyState = AnyState>({
  state,
}: {
  state: State
}): State => {
  return state.system
    .concat()
    .sort((a, b) => (a > b ? -1 : 1))
    .reduce((acc, system) => system.tick({ state: acc }), state)
}
