import { EmptyState, UnknownSystem } from '../type'

export const runOneFrame = <State extends EmptyState>(state: State) => {
  const allSystems = state.system
    .concat(state.globalSystem as unknown as UnknownSystem[])
    .sort((a, b) => (a.priority > b.priority ? 1 : -1))

  for (let i = 0; i < allSystems.length; i++) {
    const system = allSystems[i]
    if (system.tick) {
      system.tick({ state }) as State
    }
  }
}
