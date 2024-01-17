import { Entity, EmptyState } from '../type'
import { getComponent } from './getComponent'
import { getSystemByComponentName } from '../system/getSystemByName'

export const removeComponent = <State extends EmptyState>(
  state: State,
  name: string,
  entity: Entity,
): void => {
  const components = state.component[name]

  if (!components) return

  const component = getComponent(state, name, entity)
  const system = getSystemByComponentName(name, state.system)

  state.component[name].delete(entity)

  if (system && component && system.remove) {
    system.remove({ component, entity, name })
  }
}
