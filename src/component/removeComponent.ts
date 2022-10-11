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

  const { [entity]: _, ...dictionaryWithoutComponent } = state.component[name]

  const newState = {
    ...state,
    component: {
      ...state.component,
      [name]: dictionaryWithoutComponent,
    },
  }

  const component = getComponent({ name, state, entity })
  const system = getSystemByComponentName(name, newState.system)

  if (system && component && system.remove) {
    return system.remove({ state: newState, component, entity, name }) as State
  }

  return newState
}
