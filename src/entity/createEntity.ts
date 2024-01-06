import { Entity, InitialState } from '../type'

type CreateEntity = <State extends InitialState>(
  state: State,
  entity: Entity,
) => State

export const createEntity: CreateEntity = (state, entity) => {
  state.entity.set(entity, entity)

  return state
}
