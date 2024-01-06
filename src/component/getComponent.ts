import { InitialState, Entity } from '../type'

export const getComponent = <Data, State extends InitialState>(
  state: State,
  name: string,
  entity: Entity,
): Data | undefined => state.component[name]?.get(entity) as Data | undefined
