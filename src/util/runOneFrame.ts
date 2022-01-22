import { AnyState } from '../type'

export const runOneFrame = <State extends AnyState = AnyState>({
  state,
}: {
  state: State
}): State => {
  return [...state.system, ...state.globalSystem]
    .concat()
    .sort((a, b) => (a.priority > b.priority ? 1 : -1))
    .reduce(
      (acc, system) =>
        system.tick ? (system.tick({ state: acc }) as State) : acc,
      state,
    )
}
