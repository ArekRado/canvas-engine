import {
  AnyState,
  Entity,
  CollisionEvent,
  CanvasEngineEvent,
  Dictionary,
  CollisionData,
} from '../../type'
import { createGlobalSystem, systemPriority } from '../createSystem'
import { componentName } from '../../component/componentName'
import { getCollider } from './colliderCrud'
import { getTransform } from '../transform/transformCrud'
import { emitEvent } from '../../event'
import { hasSameLayer } from './hasSameLayer'
import {
  CollisionDetectorNormalizer,
  collisionsMatrix,
} from './collisionsMatrix'
import { getColliderContour } from './getColliderContour'
import { getQuadTree, getQuadTreeCollisions, RectangleData } from './quadTree'
import { getAABBCollision } from './getAABBCollision'
import { Intersection } from './getIntersection'

export let comparisionsQuadTree = 0
let colliderContours: Dictionary<RectangleData> = {}
export let previousCollisions: Dictionary<CollisionData | undefined> = {}
export let collisions: Dictionary<CollisionData | undefined> = {}

// every quadTree will be calculated on separated core
// (x**2)/2
// eg: if cpu has 8 cores then quadTree will be splited into 16 smaller quadTrees
// eg: if cpu has 4 cores then quadTree will be splited into 4 smaller quadTrees
// const quadTreeSplit = 1
// const quadTreeSplit = Math.max(
//   Math.round(navigator.hardwareConcurrency ** 2 / 4),
//   1,
// )
const quadTreeMaxLevel = 4
// 48685
// 47595
const findCollisionsInNode = ({
  entities,
  state,
}: {
  entities: Entity[]
  state: AnyState
}): [Intersection | null, Intersection | null, boolean, boolean] | null => {
  const entity = entities[0]
  const entity2 = entities[1]

  if (
    getAABBCollision({
      rectangle1: colliderContours[entity].rectangle,
      rectangle2: colliderContours[entity2].rectangle,
    }) === false
  ) {
    return null
  }

  const collider1 = getCollider({
    state,
    entity,
  })
  const transform1 = getTransform({
    state,
    entity,
  })

  if (transform1 === undefined || collider1 === undefined) {
    return null
  }

  if (entity === entity2) {
    return null
  }

  const collider2 = getCollider({
    state,
    entity: entity2,
  })
  const transform2 = getTransform({
    state,
    entity: entity2,
  })

  if (transform2 === undefined || collider2 === undefined) {
    return null
  }

  if (hasSameLayer(collider1.layer, collider2.layer) === false) {
    return null
  }

  const collisionDetector: CollisionDetectorNormalizer =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    collisionsMatrix[collider1.data.type][collider2.data.type]

  const intersection = collisionDetector({
    transform1,
    collider1Data: collider1.data,
    transform2,
    collider2Data: collider2.data,
  })

  comparisionsQuadTree++

  const { type, ...intersection2Data } = collider1.data
  return [
    intersection,
    intersection
      ? ({
          position: intersection.position,
          figure: {
            type: collider1.data.type,
            data: intersection2Data,
          },
        } as Intersection) // TODO, it will break rigidbody in a future
      : null,
    collider1.emitEventCollision,
    collider2.emitEventCollision,
  ]
}

export const colliderSystem = (state: AnyState) =>
  createGlobalSystem<AnyState>({
    state,
    name: componentName.collider,
    priority: systemPriority.collider,
    tick: ({ state }) => {
      previousCollisions = collisions
      collisions = {}

      let top = -Infinity
      let bottom = Infinity
      let left = Infinity
      let right = -Infinity

      const allColliders = Object.entries(state.component.collider)

      for (let i = 0; i < allColliders.length; i++) {
        const [entity, collider] = allColliders[i]

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

          colliderContours[entity] = {
            rectangle: colliderContour,
            entity,
          }
        }
      }

      const quadTree = getQuadTree({
        bounds: [left, bottom, right, top],
        rectangles: Object.values(colliderContours),
        maxLevel: quadTreeMaxLevel,
      })

      if (quadTree) {
        const quadTreeCollisions = getQuadTreeCollisions({
          maxLevel: quadTreeMaxLevel,
          quadTree,
        })

        for (let i = 0; i < quadTreeCollisions.length; i++) {
          const data = findCollisionsInNode({
            entities: quadTreeCollisions[i],
            state,
          })

          if (data !== null && data[0] !== null && data[1] !== null) {
            const entity1 = quadTreeCollisions[i][0]
            const entity2 = quadTreeCollisions[i][1]
            const [
              intersection1,
              _,
              emitEventCollision1,
              emitEventCollision2,
            ] = data

            if (emitEventCollision1) {
              emitEvent<CollisionEvent>({
                type: CanvasEngineEvent.colliderCollision,
                payload: {
                  colliderEntity1: entity1,
                  colliderEntity2: entity2,
                  intersection: intersection1,
                },
              })
            }

            if (emitEventCollision2) {
              emitEvent<CollisionEvent>({
                type: CanvasEngineEvent.colliderCollision,
                payload: {
                  colliderEntity1: entity2,
                  colliderEntity2: entity1,
                  intersection: intersection1,
                },
              })
            }

            // set entity collisions
            collisions[entity1] = intersection1
              ? {
                  colliderEntity: entity2,
                  intersection: intersection1,
                }
              : collisions[entity1]
            previousCollisions[entity1] = collisions[entity1]

            // set entity collider2Entity
            collisions[entity2] = intersection1
              ? {
                  colliderEntity: entity1,
                  intersection: intersection1,
                }
              : collisions[entity2]
            previousCollisions[entity2] = collisions[entity2]
          }
        }
      }

      colliderContours = {}

      return state
    },
  })
