import { v4 } from 'uuid'
import { Dictionary, Entity, Guid, State } from '../type'
import { removeComponent } from '../component'
import { vector, Vector2D, vectorZero } from '@arekrado/vector-2d'

type Generate = (
  name: string,
  options?: Partial<{
    persistOnSceneChange: boolean
    rotation: number
    fromParentRotation: number
    scale: Vector2D
    fromParentScale: Vector2D
    position: Vector2D
    fromParentPosition: Vector2D
    parentId?: Guid
  }>,
) => Entity
export const generateEntity: Generate = (
  name: string,
  options = {},
): Entity => ({
  name,
  id: v4(),
  persistOnSceneChange: options.persistOnSceneChange || false,
  rotation: options.rotation || 0,
  fromParentRotation: options.fromParentRotation || 0,
  scale: options.scale || vector(1, 1),
  fromParentScale: options.fromParentScale || vector(1, 1),
  position: options.position || vectorZero(),
  fromParentPosition: options.fromParentPosition || vectorZero(),
  parentId: options.parentId,
})

type SetEntity = (params: { entity: Entity; state: State }) => State

export const setEntity: SetEntity = ({ entity, state }) => ({
  ...state,
  entity: {
    ...state.entity,
    [entity.id]: entity,
  },
})

type GetEntity = (params: {
  entityId: Guid
  state: State
}) => Entity | undefined

export const getEntity: GetEntity = ({ entityId, state }) =>
  state.entity[entityId]

type RemoveEntity = (params: { entityId: Guid; state: State }) => State
export const removeEntity: RemoveEntity = ({ entityId, state }) => {
  const { [entityId]: _, ...stateWithoutEntity } = state.entity

  const newState = {
    ...state,
    entity: stateWithoutEntity,
  }

  const v1 = Object.keys(newState.component).reduce(
    (state, name) =>
      removeComponent(name, {
        state,
        entityId,
      }),
    newState,
  )

  return v1
}
