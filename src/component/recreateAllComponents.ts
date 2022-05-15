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
  state = Object.entries(state.component).reduce((acc, [name, value]) => {
    const system = getSystemByName(name, acc.system)

    if (!system) {
      return acc
    }

    return Object.entries(value).reduce((acc2, [entity, component]) => {
      if (system === undefined || system.create === undefined) {
        return acc2
      } else {
        const newState = system.create({
          state: acc2,
          entity,
          name,
          component,
        })
        return newState as State
      }
    }, acc)
  }, state)

  return state
}
