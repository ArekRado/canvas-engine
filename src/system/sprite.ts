import { Guid, Sprite } from '../type'
import { createSystem, systemPriority } from './createSystem'
import { State } from '../type'
import { componentName } from '../component'
import { createTexture } from '../draw/texture'
import REGL from 'regl'

let textureBuffer: { entityId: Guid; texture: REGL.Texture2D }[] = []

export const spriteSystem = (state: State) =>
  createSystem<Sprite>({
    state,
    name: componentName.sprite,
    priority: systemPriority.sprite,
    create: ({ state, component }) => {
      if (state.isDrawEnabled && state.regl) {
        const texturePromise = createTexture({
          src: component.src,
          regl: state.regl,
        })

        texturePromise.then((texture) => {
          textureBuffer.push({ entityId: component.entityId, texture })
        })
      }

      // add texture

      return state
    },
    remove: ({ state }) => {
      // remove texture?

      return state
    },
    tick: ({ state, component }) => {
      if (
        state.isDrawEnabled &&
        !component.texture &&
        textureBuffer.length > 0
      ) {
        // set async texture
        const index = textureBuffer.findIndex(
          ({ entityId }) => entityId === component.entityId,
        )

        if (index !== -1) {
          component.texture = textureBuffer[index]?.texture
          textureBuffer.splice(index, 1)
        }
      }

      return state
    },
  })
