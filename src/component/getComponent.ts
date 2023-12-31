import { AnyState, Entity } from '../type'

export const getComponent = <Data, State extends AnyState = AnyState>({
  name,
  entity,
  state,
}: {
  name: string
  entity: Entity
  state: State
}): Data | undefined => state.component[name]?.get(entity)
