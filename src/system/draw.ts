import { Sprite } from '../type'
import {
  initialize as initializePixi,
  createSprite,
  drawSprite,
  removeSprite,
} from '../util/pixiDraw'
import { createSystem } from './createSystem'
import { State } from '../type'
import { componentName } from '../component'
import { getEntity } from '..'

export const initialize = initializePixi

export const drawSystem = (state: State) =>
  createSystem<Sprite>({
    state,
    name: componentName.sprite,
    create: ({ state, component }) => {
      if (state.isDrawEnabled) {
        createSprite(component)
      }

      return state
    },
    remove: ({ state, component }) => {
      if (state.isDrawEnabled) {
        removeSprite(component)
      }

      return state
    },
    tick: ({ state, component }) => {
      if (state.isDrawEnabled) {
        const entity = getEntity({
          state,
          entityId: component.entityId,
        })

        if (entity) {
          drawSprite(entity, component)
        }
      }

      return state
    },
  })
