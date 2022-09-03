import { getSystemByComponentName } from '../system/getSystemByName'
import { AnyState, Entity } from '../type'
import { getComponent } from './getComponent'

export const updateComponent = <Data, State extends AnyState = AnyState>({
  name,
  entity,
  state,
  update,
  callSystemUpdateMethod = true,
}: {
  name: string
  entity: Entity
  state: State
  update: (component: Data) => Partial<Data>
  callSystemUpdateMethod?: boolean
}): State => {
  const previousComponent = getComponent<Data, State>({
    state,
    entity,
    name,
  })

  if (previousComponent !== undefined) {
    const updatedComponent = Object.assign(
      {},
      previousComponent,
      update(previousComponent),
    )

    state.component[name][entity] = updatedComponent

    if (callSystemUpdateMethod) {
      const system = getSystemByComponentName(name, state.system)

      if (system?.update) {
        return system.update({
          state,
          component: updatedComponent,
          previousComponent,
          entity,
          name,
        }) as State
      }
    }

    return state
  }

  return state
}
