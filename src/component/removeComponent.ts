import { AnyState, Entity } from '../type'
import { getComponent } from './getComponent'
import { getSystemByComponentName } from '../system/getSystemByName'

export const removeComponent = <State extends AnyState = AnyState>({
  name,
  entity,
  state,
}: {
  name: string
  entity: Entity
  state: State
}): State => {
  const components = state.component[name]

  if (!components) return state

  const component = getComponent({ name, state, entity })
  const system = getSystemByComponentName(name, state.system)

  state.component[name].delete(entity)

  if (system && component && system.remove) {
    return system.remove({ state: state, component, entity, name }) as State
  }

  return state
}
