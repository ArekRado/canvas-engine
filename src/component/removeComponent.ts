import { Entity, EmptyState } from '../type'
import { getComponent } from './getComponent'
import { getSystemByComponentName } from '../system/getSystemByName'

export const removeComponent = <State extends EmptyState>(
  state: State,
  name: string,
  entity: Entity,
): State => {
  const components = state.component[name]

  if (!components) return state

  const component = getComponent(state, name, entity)
  const system = getSystemByComponentName(name, state.system)

  state.component[name].delete(entity)

  if (system && component && system.remove) {
    return system.remove({ state: state, component, entity, name }) as State
  }

  return state
}
