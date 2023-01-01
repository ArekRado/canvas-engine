import {
  AnyState,
  Entity,
  CollisionEvent,
  CanvasEngineEvent,
  Dictionary,
  CollisionData,
  Collider,
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
import { defaultTransform } from '../../util/defaultComponents'

export let comparisionsQuadTree = 0
let colliderContours: Dictionary<RectangleData> = {}
export let previousCollisions: Dictionary<CollisionData | undefined> = {}
export let collisions: Dictionary<CollisionData | undefined> = {}

// TODO
// Run quadTree for each specific layer

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
}): {
  intersection1: Intersection | null
  intersection2: Intersection | null
  emitEventCollision1: boolean
  emitEventCollision2: boolean
  collisionLayer: string
} | null => {
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
  const transform1 =
    getTransform({
      state,
      entity,
    }) ?? defaultTransform()

  if (collider1 === undefined) {
    return null
  }

  if (entity === entity2) {
    return null
  }

  const collider2 = getCollider({
    state,
    entity: entity2,
  })
  const transform2 =
    getTransform({
      state,
      entity: entity2,
    }) ?? defaultTransform()

  if (collider2 === undefined) {
    return null
  }

  const collisionLayer = hasSameLayer(collider1.layer, collider2.layer)
  if (collisionLayer === undefined) {
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
  return {
    intersection1: intersection,
    intersection2: intersection
      ? ({
          position: intersection.position,
          figure: {
            type: collider1.data.type,
            data: intersection2Data,
          },
        } as Intersection) // TODO, it will break rigidbody in a future
      : null,
    emitEventCollision1: collider1.emitEventCollision,
    emitEventCollision2: collider2.emitEventCollision,
    collisionLayer,
  }
}

export const prepareColliderContours = ({ state }: { state: State }) => {
  const allColliders = Object.entries<Collider>(state.component.collider)

  if (allColliders.length === 0) {
    return undefined
  }

  let top = -Infinity
  let bottom = Infinity
  let left = Infinity
  let right = -Infinity

  for (let i = 0; i < allColliders.length; i++) {
    const [entity, collider] = allColliders[i]

    state.component.collider[entity].collision = undefined

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

      // TODO subdivide colliders into smaller areas and then create quadTree for each area

      colliderContours[entity] = {
        rectangle: colliderContour,
        entity,
      }
    }
  }

  return {
    top,
    bottom,
    left,
    right,
  }
}

export const colliderSystem = (state: AnyState) =>
  createGlobalSystem<AnyState>({
    state,
    name: componentName.collider,
    priority: systemPriority.collider,
    tick: ({ state }) => {
      previousCollisions = collisions
      collisions = {}

      const contoursData = prepareColliderContours({ state })

      if (contoursData === undefined) {
        return state
      }

      const { top, bottom, left, right } = contoursData

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

          if (
            data !== null &&
            data.intersection1 !== null &&
            data.intersection2 !== null
          ) {
            const entity1 = quadTreeCollisions[i][0]
            const entity2 = quadTreeCollisions[i][1]

            const {
              intersection1,
              intersection2,
              emitEventCollision1,
              emitEventCollision2,
              collisionLayer,
            } = data

            if (emitEventCollision1) {
              state.component.collider[entity1].collision = intersection1

              emitEvent<CollisionEvent>({
                type: CanvasEngineEvent.colliderCollision,
                payload: {
                  colliderEntity1: entity1,
                  colliderEntity2: entity2,
                  intersection: intersection1,
                  collisionLayer,
                },
              })
            }

            if (emitEventCollision2) {
              state.component.collider[entity2].collision = intersection2

              emitEvent<CollisionEvent>({
                type: CanvasEngineEvent.colliderCollision,
                payload: {
                  colliderEntity1: entity2,
                  colliderEntity2: entity1,
                  intersection: intersection2,
                  collisionLayer,
                },
              })
            }

            // set entity collisions
            collisions[entity1] = intersection1
              ? {
                  colliderEntity: entity2,
                  intersection: intersection1,
                  collisionLayer,
                }
              : collisions[entity1]
            previousCollisions[entity1] = collisions[entity1]

            // set entity collider2Entity
            collisions[entity2] = intersection1
              ? {
                  colliderEntity: entity1,
                  intersection: intersection1,
                  collisionLayer,
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
