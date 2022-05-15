import { AnyState, Guid } from '../type'

export const getComponent = <Data, State extends AnyState = AnyState>({
  name, // TODO - Data should be connected with componentName
  entity,
  state,
}: {
  name: string
  entity: Guid
  state: State
}): Data | undefined => state.component[name]?.[entity] as Data | undefined
