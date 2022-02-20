import { AnyState, Component, Guid } from '../type'
import { getComponent } from './getComponent'
import { setComponent } from './setComponent'

export const updateComponent = <Data, State extends AnyState = AnyState>({
  name,
  entity,
  state,
  update,
}: {
  name: string
  entity: Guid
  state: State
  update: (component: Component<Data>) => Partial<Component<Data>>
}): State => {
  const component = getComponent<Data, State>({
    state,
    entity,
    name,
  })

  return component !== undefined
    ? setComponent({
        state,
        data: {
          ...component,
          ...update(component),
        },
      })
    : state
}
