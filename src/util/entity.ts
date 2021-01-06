import { v4 } from 'uuid'
import { Entity, Guid, State } from '../type'
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

export const setEntity: SetEntity = ({ entity, state }) => {
  const exist = state.entity.find((x) => x.id === entity.id)
  if (exist) {
    return {
      ...state,
      entity: state.entity.map((x) => (x.id === entity.id ? entity : x)),
    }
  }

  return {
    ...state,
    entity: [...state.entity, entity],
  }
}

type GetEntity = (params: {
  entityId: Guid
  state: State
}) => Entity | undefined

export const getEntity: GetEntity = ({ entityId, state }) =>
  state.entity.find((e) => e.id === entityId)

type RemoveEntity = (params: { entityId: Guid; state: State }) => State
export const removeEntity: RemoveEntity = ({ entityId, state }) => {
  const newState = {
    ...state,
    entity: state.entity.filter((item) => item.id !== entityId),
  }

  const v1 = Object.keys(state.component).reduce(
    (state, name) =>
      removeComponent(name, {
        state,
        entityId,
      }),
    newState,
  )

  return v1
}
