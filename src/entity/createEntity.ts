import { Entity, EmptyState } from '../type'

type CreateEntity = <State extends EmptyState>(
  state: State,
  entity: Entity,
) => void

export const createEntity: CreateEntity = (state, entity) => {
  state.entity.set(entity, entity)
}
