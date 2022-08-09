import { AnyState, Entity, RectangleContour } from '../../type'
import { createGlobalSystem, systemPriority } from '../createSystem'
import { componentName } from '../../component/componentName'
import { QuadTree } from './quadTree'
import { getColliderContour } from './getColliderContour'
import { getTransform } from '../transform/transformCrud'
import { updateCollider } from '../collider/colliderCrud'

type QuadTreeCache = {
  insert: (param: {
    entity: Entity
    x: number
    y: number
    width: number
    height: number
  }) => void
  retrieve: (rectangle: RectangleContour) => Array<{ entity: Entity }>
}

export let quadTreeCache: QuadTreeCache = new QuadTree({
  bounds: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
})

export const colliderQuadTreeSystem = (state: AnyState) =>
  createGlobalSystem<AnyState>({
    state,
    name: componentName.colliderQuadTree,
    priority: systemPriority.collider,
    fixedTick: ({ state }) => {
      // if (quadTreeCache !== null) {
      //   quadTreeCache.clear()
      // }

      let top = 1
      let bottom = 0
      let left = 0
      let right = 1

      const colliderContours: Array<{
        entity: Entity
        colliderContour: RectangleContour
      }> = []

      const allColliders = Object.entries(state.component.collider)
let a:any=[];
      allColliders.forEach(([entity, collider]) => {
        const transform = getTransform({
          state,
          entity,
        })

        if (transform) {
          const colliderContour = getColliderContour({ collider, transform })
          if (top < colliderContour[1][1]) {
            top = colliderContour[1][1]
          }
          if (bottom < colliderContour[0][1]) {
            bottom = colliderContour[0][1]
          }
          if (left < colliderContour[0][0]) {
            left = colliderContour[0][0]
          }
          if (right < colliderContour[1][0]) {
            right = colliderContour[1][0]
          }

          state = updateCollider({
            state,
            entity,
            update: () => ({
              _rectangleContour: colliderContour,
            }),
          })

          a.push(colliderContour)

          colliderContours.push({
            colliderContour,
            entity,
          })
        }
      })

      quadTreeCache = new QuadTree({
        bounds: {
          x: left,
          y: bottom,
          width: right - left,
          height: top - bottom,
        },
        max_objects: 10,
        max_levels: 8
      })

      colliderContours.forEach(({ colliderContour: c, entity }) => {
        quadTreeCache.insert({
          entity,
          x: c[0][0],
          y: c[0][1],
          width: c[1][0] - c[0][0],
          height: c[1][1] - c[0][1],
        })
      })

      return state
    },
  })
