import { Entity, AnyState } from '../type'

type CreateEntity = <State extends AnyState>(params: {
  entity: Entity
  state: State
}) => State

export const createEntity: CreateEntity = ({ entity, state }) => {
  state.entity.set(entity, entity)

  return state
}
