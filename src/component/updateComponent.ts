import { Entity, EmptyState } from '../type'
import { getComponent } from './getComponent'

export const updateComponent = <Data, State extends EmptyState>(
  state: State,
  name: string,
  entity: Entity,
  update: ((component: Data) => Partial<Data>) | undefined,
): void => {
  const previousComponent = getComponent<Data, State>(state, name, entity)

  if (previousComponent !== undefined) {
    const updatedComponent =
      update === undefined
        ? previousComponent
        : Object.assign({}, previousComponent, update(previousComponent))

    state.component[name].set(entity, updatedComponent)
  }
}
