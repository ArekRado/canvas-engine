import { Entity, InitialState } from '../type'

type GetEntity = <State extends InitialState>(
  state: State,
  entity: Entity,
) => Entity | undefined
export const getEntity: GetEntity = (state, entity) => state.entity.get(entity)
