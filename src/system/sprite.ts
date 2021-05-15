import { Guid, Sprite } from '../type'
import { createSystem, systemPriority } from './createSystem'
import { State } from '../type'
import { componentName } from '../component'
import { getEntity } from '..'
import { drawSprite } from '../draw/drawSprite'
import { createTexture } from '../draw/texture'
import { regl } from '../draw/regl'
import REGL from 'regl'

let textureBuffer: { entityId: Guid; texture: REGL.Texture2D }[] = []

export const drawSystem = (state: State) =>
  createSystem<Sprite>({
    state,
    name: componentName.sprite,
    priority: systemPriority.sprite,
    create: ({ state, component }) => {
      if (state.isDrawEnabled) {
        const texturePromise = createTexture({
          src: component.src,
          regl: regl(),
        })

        texturePromise.then((texture) => {
          textureBuffer.push({ entityId: component.entityId, texture })
        })
      }

      // add texture

      return state
    },
    remove: ({ state }) => {
      // if (state.isDrawEnabled) {
      // removeSprite(component.entityId)
      // }

      // remove texture

      return state
    },
    tick: ({ state, component }) => {
      if (state.isDrawEnabled) {
        const entity = getEntity({
          state,
          entityId: component.entityId,
        })

        // set async texture
        if (!component.texture && textureBuffer.length > 0) {
          const index = textureBuffer.findIndex(
            ({ entityId }) => entityId === component.entityId,
          )

          if (index !== -1) {
            component.texture = textureBuffer[index]?.texture
            textureBuffer.splice(index, 1)
          }
        }

        if (entity) {
          drawSprite({ entity, sprite: component })
        }
      }

      return state
    },
  })
