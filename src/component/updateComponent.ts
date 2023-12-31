import { AnyState, Entity } from '../type'
import { getComponent } from './getComponent'

export const updateComponent = <Data, State extends AnyState = AnyState>({
  name,
  entity,
  state,
  update,
}: {
  name: string
  entity: Entity
  state: State
  update: ((component: Data) => Partial<Data>) | undefined
}): State => {
  const previousComponent = getComponent<Data, State>({
    state,
    entity,
    name,
  })

  if (previousComponent !== undefined) {
    const updatedComponent =
      update === undefined
        ? previousComponent
        : Object.assign({}, previousComponent, update(previousComponent))

    state.component[name].set(entity, updatedComponent)

    return state
  }

  return state
}
