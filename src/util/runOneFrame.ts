import { AnyState, AnyStateForSystem, SystemMethodParams } from '../type'

export const triggerFixedTick = <
  State extends AnyStateForSystem = AnyStateForSystem,
>({
  state,
  fixedTick,
}: {
  state: State
  fixedTick: (params: SystemMethodParams<unknown, State>) => State
}) => {
  
}

export const runOneFrame = <State extends AnyState = AnyState>({
  state,
}: {
  state: State
}): State => {
  return [...state.system, ...state.globalSystem]
    .concat()
    .sort((a, b) => (a.priority > b.priority ? 1 : -1))
    .reduce((acc, system) => {
      acc = system.fixedTick
        ? triggerFixedTick({ state: acc, fixedTick: system.fixedTick })
        : acc
      acc = system.tick ? (system.tick({ state: acc }) as State) : acc

      return acc
    }, state)
}
