import { Entity, EmptyState } from '../type'

type GetEntity = <State extends EmptyState>(
  state: State,
  entity: Entity,
) => Entity | undefined
export const getEntity: GetEntity = (state, entity) => state.entity.get(entity)
