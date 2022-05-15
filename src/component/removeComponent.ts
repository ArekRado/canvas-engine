import { AnyState, Guid } from '../type'
import { getComponent } from './getComponent'
import { getSystemByName } from '../system/getSystemByName'

export const removeComponent = <State extends AnyState = AnyState>({
  name,
  entity,
  state,
}: {
  name: string
  entity: Guid
  state: State
}): State => {
  const { [entity]: _, ...dictionaryWithoutComponent } = state.component[name]

  const newState = {
    ...state,
    component: {
      ...state.component,
      [name]: dictionaryWithoutComponent,
    },
  }

  const component = getComponent({ name, state, entity })
  const system = getSystemByName(name, newState.system)

  if (system && component && system.remove) {
    return system.remove({ state: newState, component, entity, name }) as State
  }

  return newState
}
