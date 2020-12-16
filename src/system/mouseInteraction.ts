import { add } from '@arekrado/vector-2d'
import { getComponent, setComponent } from '../component'
import {
  CollideBox,
  CollideCircle,
  Mouse,
  MouseInteraction,
  Transform,
} from '../type'
import { State } from '../type'
import { createSystem } from './createSystem'
import { componentName } from '../component'
import {
  detectPointBoxCollision,
  detectPointCircleCollision,
} from '../util/detectCollision'

type IsMouseOver = (params: {
  mouse: Mouse
  collideBox?: CollideBox
  collideCircle?: CollideCircle
  transform: Transform
}) => boolean
export const isMouseOver: IsMouseOver = ({
  mouse,
  collideBox,
  collideCircle,
  transform,
}) => {
  let hasCollision = false
  if (transform) {
    if (collideBox) {
      hasCollision = detectPointBoxCollision({
        point: mouse.position,
        box: {
          position: add(transform.position, collideBox.position),
          size: collideBox.size,
        },
      })
    }
    if (!hasCollision && collideCircle) {
      hasCollision = detectPointCircleCollision({
        point: mouse.position,
        circle: {
          position: add(transform.position, collideCircle.position),
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
      const entity = component.entity
      const transform = getComponent<Transform>(componentName.transform, {
        state,
        entity,
      })
      const collideBox = getComponent<CollideBox>(componentName.collideBox, {
        state,
        entity,
      })
      const collideCircle = getComponent<CollideCircle>(
        componentName.collideCircle,
        { state, entity },
      )

      const mouse = state.mouse

      if (transform && (collideBox || collideCircle)) {
        const isMouseOverFlag = isMouseOver({
          transform,
          mouse,
          collideBox,
          collideCircle,
        })

        const isMouseEnter = !component.isMouseOver && isMouseOverFlag
        const isMouseLeave = component.isMouseOver && !isMouseOverFlag

        return setComponent(componentName.mouseInteraction, {
          state,
          data: {
            entity,
            name: componentName.mouseInteraction,
            isDoubleClicked: false, // TODO
            isMouseOver: isMouseOverFlag,
            isMouseEnter,
            isMouseLeave,
          },
        })
      }

      return state
    },
  })
