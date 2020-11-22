import { Sprite, Transform } from '../type'
import { initialize as initializePixi, render } from '../util/pixiDraw'
import { createSystem } from './createSystem'
import { State } from '../type'
import { componentName } from '../component'
import { getComponent } from '../component'

export type DrawState = {
  sprite: Sprite
  transform: Transform
}

export const initialize = initializePixi

export const drawSystem = (state: State) =>
  createSystem<Sprite>({
    state,
    name: componentName.sprite,
    create: ({ state }) => state,
    remove: ({ state }) => state,
    tick: ({ state, component: sprite }) => {
      if (state.isDrawEnabled && sprite) {
        const transform = getComponent<Transform>({
          name: componentName.transform,
          state,
          entity: sprite.entity,
        })

        if (transform) {
          render(
            {
              sprite,
              transform,
            },
            false,
          )
        }
      }

      return state
    },
  })
