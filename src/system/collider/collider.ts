import {
  AnyState,
  Collider,
  Entity,
  CollisionEvent,
  CanvasEngineEvent,
  Dictionary,
} from '../../type'
import { createGlobalSystem, systemPriority } from '../createSystem'
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

export let comparisionsQuadTree = 0
// let collisionComparisionCache: Dictionary<number> = {}

const findCollisionsInNode = ({
  entities,
  state,
}: {
  entities: Entity[]
  state: AnyState
}): AnyState => {
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i]
    const collisions: Array<Collider['_collisions'][0]> = []

    const collider = getCollider({
      state,
      entity,
    })
    const transform1 = getTransform({
      state,
      entity,
    })

    if (transform1 === undefined || collider === undefined) {
      continue
    }

    const colliderData = collider.data

    for (let j = 0; j < entities.length; j++) {
      const collider2Entity = entities[j]
      // const cacheKey = `${entity}-${collider2Entity}`

      // if (collisionComparisionCache[cacheKey] !== undefined) {
      //   continue
      // } else {
      //   collisionComparisionCache[cacheKey] = 1
      // }

      if (entity === collider2Entity) {
        continue
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
        continue
      }

      if (hasSameLayer(collider.layer, collider2.layer) === false) {
        continue
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
    }
  }

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

      const colliderContours: Array<RectangleData> = []

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

          colliderContours.push({
            rectangle: colliderContour,
            entity,
          })
        }
      }

      const maxLevel = 5
      const quadTree = getQuadTree({
        bounds: [bottom, left, top, right],
        rectangles: colliderContours,
        maxLevel,
      })

      if (quadTree) {
        const collisions = getQuadTreeCollisions({
          maxLevel,
          quadTree,
        })

        // collisionComparisionCache = {}

        for (let i = 0; i < collisions.length; i++) {
          state = findCollisionsInNode({
            entities: collisions[i],
            state,
          })
        }
      }

      return state
    },
  })
