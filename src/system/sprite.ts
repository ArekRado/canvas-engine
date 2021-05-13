import { Sprite } from '../type'
import { createSystem, systemPriority } from './createSystem'
import { State } from '../type'
import { componentName } from '../component'
import { getEntity } from '..'
import { drawSprite } from '../draw/drawSprite'
import { createTexture } from '../draw/texture'
import { regl } from '../draw/regl'

export const drawSystem = (state: State) =>
  createSystem<Sprite>({
    state,
    name: componentName.sprite,
    priority: systemPriority.sprite,
    create: ({ state, component }) => {
      if (state.isDrawEnabled) {
        const texture = createTexture({
          src: component.src,
          regl: regl(),
        })

        texture.then(() => {})
      }

      // add texture

      return state
    },
    remove: ({ state }) => {
      if (state.isDrawEnabled) {
        // removeSprite(component.entityId)
      }

      // remove texture

      return state
    },
    tick: ({ state, component }) => {
      if (state.isDrawEnabled) {
        const entity = getEntity({
          state,
          entityId: component.entityId,
        })

        if (entity) {
          drawSprite({ entity, sprite: component })
        }
      }

      return state
    },
  })
