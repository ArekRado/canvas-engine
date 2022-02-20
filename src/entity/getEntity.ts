import { AnyState, Entity, Guid } from '../type'

type GetEntity = <State extends AnyState>(params: {
  entity: Guid
  state: State
}) => Entity | undefined
export const getEntity: GetEntity = ({ entity, state }) => state.entity[entity]
