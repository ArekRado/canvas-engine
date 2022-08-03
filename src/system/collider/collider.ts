import {
  AnyState,
  Transform,
  Collider,
  Entity,
  CollisionEvent,
  CanvasEngineEvent,
  Dictionary,
} from '../../type'
import { createSystem, systemPriority } from '../createSystem'
import { getComponent } from '../../component/getComponent'
import { componentName } from '../../component/componentName'
import { updateCollider } from './colliderCrud'
import { getTransform } from '../transform/transformCrud'
import { emitEvent } from '../../event'
import { hasSameLayer } from './hasSameLayer'
import {
  CollisionDetectorNormalizer,
  collisionsMatrix,
} from './collisionsMatrix'
import { getColliderContour } from './getColliderContour'

type FindCollisionsWith = (pramams: {
  entity: Entity
  state: AnyState
  component: Collider
}) => Array<Collider['_collisions'][0]>
const findCollisionsWith: FindCollisionsWith = ({
  state,
  component,
  entity,
}) => {
  const transform = getTransform({
    state,
    entity,
  })
  if (!transform) return []

  const collisionList: Array<Collider['_collisions'][0]> = []

  const allColliders = Object.entries(
    state.component.collider as Dictionary<Collider>,
  )

  const colliderData = component.data
  allColliders.forEach(([collider2Entity, collider2]) => {
    // Do not test collision with the same colliders
    if (entity === collider2Entity) {
      return
    }

    if (hasSameLayer(component.layer, collider2.layer) === false) {
      return
    }

    // TODO Do not test collision if collision already exist
    // if (
    //   collider2.collisions.find((collision) => collision.entity === entity)
    // ) {
    //   return setCollider2Collisions - how?
    // }

    const transform2 = getComponent<Transform>({
      state,
      entity: collider2Entity,
      name: componentName.transform,
    })

    if (!transform2) {
      return
    }

    const collider2Data = collider2.data
    const collisionDetector: CollisionDetectorNormalizer =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      collisionsMatrix[colliderData.type][collider2Data.type]

    const intersection = collisionDetector({
      transform1: transform,
      collider1Data: colliderData,
      transform2,
      collider2Data: collider2Data,
    })

    if (intersection !== null) {
      collisionList.push({
        colliderEntity: collider2Entity,
        intersection,
      })

      emitEvent<CollisionEvent>({
        type: CanvasEngineEvent.colliderCollision,
        payload: {
          colliderEntity1: entity,
          colliderEntity2: collider2Entity,
          intersection,
        },
      })
    }
  })

  return collisionList
}

export const colliderSystem = (state: AnyState) =>
  createSystem<Collider, AnyState>({
    state,
    name: componentName.collider,
    componentName: componentName.collider,
    priority: systemPriority.collider,
    create: ({ state, entity, component }) => {
      const transform = getTransform({ state, entity })

      if (transform) {
        state = updateCollider({
          callSystemUpdateMethod: false,
          state,
          entity,
          update: () => ({
            _rectangleContour: getColliderContour({
              collider: component,
              transform,
            }),
          }),
        })
      }

      return state
    },
    update: ({ state, entity, component, previousComponent }) => {
      if (component.data !== previousComponent.data) {
        const transform = getTransform({ state, entity })

        if (transform) {
          state = updateCollider({
            callSystemUpdateMethod: false,
            state,
            entity,
            update: () => ({
              _rectangleContour: getColliderContour({
                collider: component,
                transform,
              }),
            }),
          })
        }
      }
      return state
    },
    fixedTick: ({ state, component, entity }) => {
      // cache.reset()

      const collisions = findCollisionsWith({
        entity,
        state,
        component,
      })

      return updateCollider({
        state,
        entity,
        update: (collider) => ({
          _previousCollisions: collider._collisions,
          _collisions: collisions,
        }),
      })
    },
  })
