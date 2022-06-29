import { AnyState, Entity } from '../type'

type GetEntity = <State extends AnyState>(params: {
  entity: Entity
  state: State
}) => Entity | undefined
export const getEntity: GetEntity = ({ entity, state }) => state.entity[entity]
