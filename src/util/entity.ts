import { v4 } from 'uuid'
import { Component, Entity, Guid, State } from '../type'
import { componentName, getComponent, removeComponent } from '../component'
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
export const generate: Generate = (name: string, options = {}): Entity => ({
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

type Params = {
  entity: Entity
  state: State
}

export const set = ({ entity, state }: Params): State => {
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

type Get = {
  entityId: Guid
  state: State
}
export const get = ({ entityId, state }: Get): Entity | undefined =>
  state.entity.find((e) => e.id === entityId)

export const remove = ({ entity, state }: Params): State => {
  const newState = {
    ...state,
    entity: state.entity.filter((item) => item !== entity),
  }

  const v1 = Object.keys(state.component).reduce(
    (state, name) =>
      removeComponent(name, {
        state,
        entity,
      }),
    newState,
  )

  return v1
}

export type GetChildren = (params: {
  entity: Entity
  state: State
  componentName: keyof State['component']
}) => Entity[] | undefined

export const getChildren: GetChildren = ({
  entity,
  state,
  componentName: cn,
}) => {
  if (state.component[cn]) {
    state.component[cn].filter((component: Component<any>) => {
      const transform = getComponent<Transform>(componentName.transform, {
        state,
        entity: component.entity,
      })

      if (transform?.parent?.id === entity.id) {
        return true
      }

      return false
    })
  }

  return undefined
}
