import { Sprite, Transform } from '../type'
import { initialize as initializePixi, render } from '../util/pixiDraw'
import { createSystem } from './createSystem'
import { transform as transformComponent } from '../component/transform'
import { State } from '../type'

export type DrawState = {
  sprite: Sprite
  transform: Transform
}

export const initialize = initializePixi

export const drawSystem = (state: State) =>
  createSystem<Sprite>({
    state,
    name: 'sprite',
    create: ({ state }) => state,
    remove: ({ state }) => state,
    tick: ({ state, component: sprite }) => {
      if (state.isDrawEnabled && sprite) {
        const transform = transformComponent.get({
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
