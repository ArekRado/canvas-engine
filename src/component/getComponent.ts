import { AnyState, Component, Guid } from '../type'

export const getComponent = <Data, State extends AnyState = AnyState>({
  name, // TODO - Data should be connected with componentName
  entity,
  state,
}: {
  name: string
  entity: Guid
  state: State
}): Component<Data> | undefined =>
  state.component[name]?.[entity] as Component<Data> | undefined
