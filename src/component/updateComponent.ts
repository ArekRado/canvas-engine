import { getSystemByName } from '../system/getSystemByName'
import { AnyState, Guid } from '../type'
import { getComponent } from './getComponent'

export const updateComponent = <Data, State extends AnyState = AnyState>({
  name,
  entity,
  state,
  update,
}: {
  name: string
  entity: Guid
  state: State
  update: (component: Data) => Partial<Data>
}): State => {
  const previousComponent = getComponent<Data, State>({
    state,
    entity,
    name,
  })

  if (previousComponent !== undefined) {
    const system = getSystemByName(name, state.system)

    const updatedComponent = {
      ...previousComponent,
      ...update(previousComponent),
    }

    const newState = {
      ...state,
      component: {
        ...state.component,
        [name]: {
          ...state.component[name],
          [entity]: updatedComponent,
        },
      },
    }

    if (system?.update) {
      return system.update({
        state: newState,
        component: updatedComponent,
        previousComponent,
        entity,
        name,
      }) as State
    }

    return newState
  }

  return state
}
