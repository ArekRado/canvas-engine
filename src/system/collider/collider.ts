import {
  AnyState,
  Transform,
  Collider,
  Entity,
  CollisionEvent,
  CanvasEngineEvent,
  Dictionary,
} from '../../type'
import { createGlobalSystem, systemPriority } from '../createSystem'
import { getComponent } from '../../component/getComponent'
import { componentName } from '../../component/componentName'
import { getCollider, updateCollider } from './colliderCrud'
import { getTransform } from '../transform/transformCrud'
import { emitEvent } from '../../event'
import { hasSameLayer } from './hasSameLayer'
import {
  CollisionDetectorNormalizer,
  collisionsMatrix,
} from './collisionsMatrix'
import { getColliderContour } from './getColliderContour'
import { getQuadTree, getQuadTreeCollisions, RectangleData } from './quadTree'

export let comparisions = 0
export let comparisionsQuadTree = 0
let collisionComparisionCache: Dictionary<number> = {}

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

  // const possibleColliderCollisions = quadTreeCache

  const colliderData = component.data
  allColliders.forEach(([collider2Entity, collider2]) => {
    // if(possibleColliderCollisions.length === 1)
    // possibleColliderCollisions.forEach(({ entity: collider2Entity }) => {
    // const collider2 = getCollider({
    //   state,
    //   entity: collider2Entity,
    // })

    // Do not test collision with the same colliders
    if (collider2 === undefined || entity === collider2Entity) {
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

    comparisions++

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

const findCollisionsInNode = ({
  entities,
  state,
}: {
  entities: Entity[]
  state: AnyState
}): AnyState => {
  entities.forEach((entity) => {
    const collisions: Array<Collider['_collisions'][0]> = []

    const collider = getCollider({
      state,
      entity,
    })
    const transform1 = getTransform({
      state,
      entity,
    })

    if (transform1 === undefined || collider === undefined) return

    const colliderData = collider.data

    entities.forEach((collider2Entity) => {
      const cacheKey = `${entity}-${collider2Entity}`

      if (collisionComparisionCache[cacheKey] !== undefined) {
        return
      } else {
        collisionComparisionCache[cacheKey] = 1
      }

      if (entity === collider2Entity) {
        return
      }

      const collider2 = getCollider({
        state,
        entity: collider2Entity,
      })
      const transform2 = getTransform({
        state,
        entity: collider2Entity,
      })

      if (transform2 === undefined || collider2 === undefined) {
        return
      }

      if (hasSameLayer(collider.layer, collider2.layer) === false) {
        return
      }

      const collider2Data = collider2.data
      const collisionDetector: CollisionDetectorNormalizer =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        collisionsMatrix[colliderData.type][collider2Data.type]

      const intersection = collisionDetector({
        transform1,
        collider1Data: colliderData,
        transform2,
        collider2Data: collider2Data,
      })

      // if (
      //   (entity === '1' && collider2Entity === '2') ||
      //   (entity === '2' && collider2Entity === '1')
      // ) {
      //   console.log({
      //     intersection,
      //     position: transform1.position,
      //     collider1Data: colliderData,
      //     position2: transform2.position,
      //     collider2Data: collider2Data,
      //   })
      // }

      comparisionsQuadTree++

      if (intersection !== null) {
        collisions.push({
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

      state = updateCollider({
        state,
        entity,
        update: (collider) => ({
          _previousCollisions: collider._collisions,
          _collisions: collisions,
        }),
      })
    })

    // console.log(`entity ${entity} collisions`, collisions)
  })

  return state
}

export const colliderSystem = (state: AnyState) =>
  createGlobalSystem<AnyState>({
    state,
    name: componentName.collider,
    priority: systemPriority.collider,
    fixedTick: ({ state }) => {
      let top = -Infinity
      let bottom = Infinity
      let left = Infinity
      let right = -Infinity

      // const colliders = Object.entries<Collider>(state.component.collider)

      const colliderContours: Array<RectangleData> = []

      const allColliders = Object.entries(state.component.collider)

      allColliders.forEach(([entity, collider]) => {
        const transform = getTransform({
          state,
          entity,
        })

        if (transform) {
          const colliderContour = getColliderContour({ collider, transform })
          if (top < colliderContour[3]) {
            top = colliderContour[3]
          }
          if (bottom > colliderContour[1]) {
            bottom = colliderContour[1]
          }
          if (left > colliderContour[0]) {
            left = colliderContour[0]
          }
          if (right < colliderContour[2]) {
            right = colliderContour[2]
          }

          // state = updateCollider({
          //   state,
          //   entity,
          //   update: () => ({
          //     _rectangleContour: colliderContour,
          //   }),
          // })

          colliderContours.push({
            rectangle: colliderContour,
            entity,
          })
        }
      })

      const quadTree = getQuadTree({
        bounds: [bottom, left, top, right],
        rectangles: colliderContours,
        maxLevel: 5,
      })

      const collisions = getQuadTreeCollisions({
        maxLevel: 5,
        quadTree,
      })

      // console.log({
      //   bounds: [bottom, left, top, right],
      //   colliderContours: JSON.stringify(colliderContours),
      //   collisions,
      //   // quadTree: JSON.stringify(quadTree),
      // })

      collisionComparisionCache = {}

      collisions.forEach((entities) => {
        state = findCollisionsInNode({
          entities,
          state,
        })
      })

      // colliders.forEach(([entity, component]) => {
      //   const collisions = findCollisionsWith({
      //     entity,
      //     state,
      //     component,
      //   })

      //   state = updateCollider({
      //     state,
      //     entity,
      //     update: (collider) => ({
      //       _previousCollisions: collider._collisions,
      //       _collisions: collisions,
      //     }),
      //   })
      // })

      return state
    },
  })
