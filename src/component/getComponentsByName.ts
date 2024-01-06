import { InitialState, Entity } from '../type'

export const getComponentsByName = <
  Data,
  State extends InitialState,
>(
  state: State,
  name: string,
) => state.component[name] as Map<Entity, Data> | undefined
