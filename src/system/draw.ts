import { CollideBox, CollideCircle, Entity, Sprite } from '../type'
import { initialize as initializePixi, render } from '../util/pixiDraw'
import { createSystem } from './createSystem'
import { State } from '../type'
import { componentName, getComponent } from '../component'
import { getEntity } from '..'

export type DrawState = {
  sprite: Sprite
  entity: Entity
  collideBox?: CollideBox
  collideCircle?: CollideCircle
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
          entityId: sprite.entityId,
        })

        if (entity) {
          if (state.isDebugInitialized) {
            const collideBox = getComponent<CollideBox>(
              componentName.collideBox,
              {
                state,
                entityId: sprite.entityId,
              },
            )
            const collideCircle = getComponent<CollideCircle>(
              componentName.collideCircle,
              {
                state,
                entityId: sprite.entityId,
              },
            )

            render(
              {
                sprite,
                entity,
                collideBox,
                collideCircle,
              },
              true,
            )
          } else {
            render(
              {
                sprite,
                entity,
              },
              false,
            )
          }
        }
      }

      return state
    },
  })
