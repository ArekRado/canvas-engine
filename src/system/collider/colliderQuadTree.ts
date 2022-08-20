import { AnyState, Entity, RectangleContour } from '../../type'
import { createGlobalSystem, systemPriority } from '../createSystem'
import { componentName } from '../../component/componentName'
import { getColliderContour } from './getColliderContour'
import { getTransform } from '../transform/transformCrud'
import { updateCollider } from './colliderCrud'

export let quadTreeCache = []

export const colliderQuadTreeSystem = (state: AnyState) =>
  createGlobalSystem<AnyState>({
    state,
    name: componentName.colliderQuadTree,
    priority: systemPriority.collider,
    fixedTick: ({ state }) => {
      let top = 1
      let bottom = 0
      let left = 0
      let right = 1

      const colliderContours: Array<{
        entity: Entity
        colliderContour: RectangleContour
      }> = []

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
          if (bottom < colliderContour[1]) {
            bottom = colliderContour[1]
          }
          if (left < colliderContour[0]) {
            left = colliderContour[0]
          }
          if (right < colliderContour[2]) {
            right = colliderContour[2]
          }

          state = updateCollider({
            state,
            entity,
            update: () => ({
              _rectangleContour: colliderContour,
            }),
          })

          // a.push(colliderContour)

          colliderContours.push({
            colliderContour,
            entity,
          })
        }
      })

      // quadTreeCache = new (QuadTree as any)({
      //   bounds: {
      //     x: left,
      //     y: bottom,
      //     width: right - left,
      //     height: top - bottom,
      //   },
      //   max_objects: 10,
      //   max_levels: 8
      // })

      // colliderContours.forEach(({ colliderContour: c, entity }) => {
      //   quadTreeCache.insert({
      //     entity,
      //     x: c[0],
      //     y: c[1],
      //     width: c[2] - c[0],
      //     height: c[3] - c[1],
      //   })
      // })

      return state
    },
  })
