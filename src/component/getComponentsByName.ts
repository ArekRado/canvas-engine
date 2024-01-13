import { EmptyState, Entity } from '../type'

export const getComponentsByName = <
  Data,
  State extends EmptyState,
>(
  state: State,
  name: string,
) => state.component[name] as Map<Entity, Data> | undefined
