import { Entity, EmptyState } from '../type'

type CreateEntity = <State extends EmptyState>(
  state: State,
  entity: Entity,
) => State

export const createEntity: CreateEntity = (state, entity) => {
  state.entity.set(entity, entity)

  return state
}
