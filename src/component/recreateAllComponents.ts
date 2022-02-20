import { AnyState } from '../type'
import { getSystemByName } from '../system/getSystemByName'

/**
 * Calls create system method for all components. Useful when newly loaded components have to call side effects
 */
export const recreateAllComponents = <State extends AnyState = AnyState>({
  state,
}: {
  state: State
}): State => {
  state = Object.entries(state.component).reduce((acc, [key, value]) => {
    const system = getSystemByName(key, acc.system)

    if (!system) {
      return acc
    }

    return Object.values(value).reduce((acc2, component) => {
      if (system === undefined || system.create === undefined) {
        return acc2
      } else {
        const newState = system.create({
          state: acc2,
          component,
        })
        return newState as State
      }
    }, acc)
  }, state)

  return state
}
