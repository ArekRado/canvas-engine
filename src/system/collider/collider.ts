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

export let comparisionsQuadTree = 0
let colliderContours: Dictionary<RectangleData> = {}
export let previousCollisions: Dictionary<CollisionData | undefined> = {}
export let collisions: Dictionary<CollisionData | undefined> = {}

const findCollisionsInNode = ({
  entities,
  state,
}: {
  entities: Entity[]
  state: AnyState
}): AnyState => {
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i]

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

      if (entity === collider2Entity) {
        continue
      }

      if (
        getAABBCollision({
          rectangle1: colliderContours[entity].rectangle,
          rectangle2: colliderContours[collider2Entity].rectangle,
        }) === false
      ) {
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

      const collisionDetector: CollisionDetectorNormalizer =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        collisionsMatrix[colliderData.type][collider2.data.type]

      const intersection = collisionDetector({
        transform1,
        collider1Data: colliderData,
        transform2,
        collider2Data: collider2.data,
      })

      comparisionsQuadTree++

      if (intersection !== null) {
        if (collider.emitEventCollision) {
          emitEvent<CollisionEvent>({
            type: CanvasEngineEvent.colliderCollision,
            payload: {
              colliderEntity1: entity,
              colliderEntity2: collider2Entity,
              intersection,
            },
          })
        }

        if (collider2.emitEventCollision) {
          emitEvent<CollisionEvent>({
            type: CanvasEngineEvent.colliderCollision,
            payload: {
              colliderEntity1: collider2Entity,
              colliderEntity2: entity,
              intersection,
            },
          })
        }
      }

      // set entity collisions
      collisions[entity] = intersection
        ? {
            colliderEntity: collider2Entity,
            intersection,
          }
        : collisions[entity]
      previousCollisions[entity] = collisions[entity]

      // set entity collider2Entity
      collisions[collider2Entity] = intersection
        ? {
            colliderEntity: entity,
            intersection,
          }
        : collisions[collider2Entity]
      previousCollisions[collider2Entity] = collisions[collider2Entity]
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

      const maxLevel = 5
      const quadTree = getQuadTree({
        bounds: [left, bottom, right, top],
        rectangles: Object.values(colliderContours),
        maxLevel,
      })

      if (quadTree) {
        const collisions = getQuadTreeCollisions({
          maxLevel,
          quadTree,
        })

        for (let i = 0; i < collisions.length; i++) {
          state = findCollisionsInNode({
            entities: collisions[i],
            state,
          })
        }
      }
      // console.log('colliderContours',colliderContours)

      colliderContours = {}

      return state
    },
  })
