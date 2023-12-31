import { AnyState, Entity } from '../type'

export const getComponentsByName = <Data, State extends AnyState = AnyState>({
  name,
  state,
}: {
  name: string
  state: State
}) => state.component[name] as Map<Entity, Data> | undefined
