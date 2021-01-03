import { add } from '@arekrado/vector-2d'
import { getComponent, setComponent } from '../component'
import {
  CollideBox,
  CollideCircle,
  Entity,
  Mouse,
  MouseInteraction,
} from '../type'
import { State } from '../type'
import { createSystem } from './createSystem'
import { componentName } from '../component'
import {
  detectPointBoxCollision,
  detectPointCircleCollision,
} from '../util/detectCollision'
import { getEntity } from '../util/entity'

type IsMouseOver = (params: {
  mouse: Mouse
  collideBox?: CollideBox
  collideCircle?: CollideCircle
  entity: Entity
}) => boolean
export const isMouseOver: IsMouseOver = ({
  mouse,
  collideBox,
  collideCircle,
  entity,
}) => {
  let hasCollision = false
  if (entity) {
    if (collideBox) {
      hasCollision = detectPointBoxCollision({
        point: mouse.position,
        box: {
          position: add(entity.position, collideBox.position),
          size: collideBox.size,
        },
      })
    }
    if (!hasCollision && collideCircle) {
      hasCollision = detectPointCircleCollision({
        point: mouse.position,
        circle: {
          position: add(entity.position, collideCircle.position),
          radius: collideCircle.radius,
        },
      })
    }
  }

  return hasCollision
}

export const mouseInteractionSystem = (state: State) =>
  createSystem<MouseInteraction>({
    state,
    name: componentName.mouseInteraction,
    create: ({ state }) => state,
    remove: ({ state }) => state,
    tick: ({ state, component }) => {
      const entity = getEntity({
        state,
        entityId: component.entity.id,
      })
      if (entity) {
        const collideBox = getComponent<CollideBox>(componentName.collideBox, {
          state,
          entity,
        })
        const collideCircle = getComponent<CollideCircle>(
          componentName.collideCircle,
          { state, entity },
        )

        const mouse = state.mouse

        if (collideBox || collideCircle) {
          const isMouseOverFlag = isMouseOver({
            entity,
            mouse,
            collideBox,
            collideCircle,
          })

          const isMouseEnter = !component.isMouseOver && isMouseOverFlag
          const isMouseLeave = component.isMouseOver && !isMouseOverFlag
          const isClicked = component.isMouseOver && state.mouse.buttons === 1

          return setComponent<MouseInteraction>(
            componentName.mouseInteraction,
            {
              state,
              data: {
                entity,
                name: componentName.mouseInteraction,
                isClicked,
                isDoubleClicked: false, // TODO
                isMouseOver: isMouseOverFlag,
                isMouseEnter,
                isMouseLeave,
              },
            },
          )
        }
      }

      return state
    },
  })
