import { Entity, Sprite } from '../type'
import { initialize as initializePixi, render } from '../util/pixiDraw'
import { createSystem } from './createSystem'
import { State } from '../type'
import { componentName } from '../component'
import { getEntity } from '..'

export type DrawState = {
  sprite: Sprite
  entity: Entity
}

export const initialize = initializePixi

export const drawSystem = (state: State) =>
  createSystem<Sprite>({
    state,
    name: componentName.sprite,
    create: ({ state }) => state,
    remove: ({ state }) => state,
    tick: ({ state, component: sprite }) => {
      if (state.isDrawEnabled) {
        const entity = getEntity({
          state,
          entityId: sprite.entityId
        })

        entity && render(
          {
            sprite,
            entity,
          },
          false,
        )
      }

      return state
    },
  })
