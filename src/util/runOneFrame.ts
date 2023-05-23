import { AnyState, AnySystem, GlobalSystem } from '../type'

export const runOneFrame = <State extends AnyState = AnyState>({
  state,
}: {
  state: State
}): State => {

  const allSystems: Array<AnySystem | GlobalSystem<AnyState>> = state.system
    .concat(state.globalSystem as unknown as AnySystem[])
    .sort((a, b) => (a.priority > b.priority ? 1 : -1))

  for (let i = 0; i < allSystems.length; i++) {
    const system = allSystems[i]
    if (system.tick) {
      state = system.tick({ state }) as State
    }
  }

  return state
}
