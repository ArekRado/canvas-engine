import { add } from '@arekrado/vector-2d'
import { getComponent, setComponent } from '../component'
import {
  CollideBox,
  CollideCircle,
  InternalInitialState,
  Mouse,
  MouseInteraction,
} from '../type'
import { createSystem } from './createSystem'
import { componentName } from '../component'
import {
  detectPointBoxCollision,
  detectPointCircleCollision,
} from '../util/detectCollision'
import { getMouse } from './mouse'
import { Transform } from '..'
import { parseV3ToV2 } from '../util/parseV3ToV2'

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
  if (collideBox) {
    hasCollision = detectPointBoxCollision({
      point: mouse.position,
      box: {
        position: add(parseV3ToV2(transform.position), collideBox.position),
        size: collideBox.size,
      },
    })
  }
  if (!hasCollision && collideCircle) {
    hasCollision = detectPointCircleCollision({
      point: mouse.position,
      circle: {
        position: add(parseV3ToV2(transform.position), collideCircle.position),
        radius: collideCircle.radius,
      },
    })
  }

  return hasCollision
}

export const mouseInteractionSystem = (state: InternalInitialState) =>
  createSystem<MouseInteraction, InternalInitialState>({
    state,
    name: componentName.mouseInteraction,
    componentName: componentName.mouseInteraction,
    create: ({ state }) => state,
    remove: ({ state }) => state,
    tick: ({ state, component }) => {
      // todo rewrite it to set/getMouseInteraction
      // set mouse interaction on mouse move events
      const entity = component.entity

      const collideBox = getComponent<CollideBox>({
        name: componentName.collideBox,
        state,
        entity,
      })
      const collideCircle = getComponent<CollideCircle>({
        name: componentName.collideCircle,
        state,
        entity,
      })
      const transform = getComponent<Transform>({
        name: componentName.transform,
        state,
        entity,
      })

      const mouse = getMouse({ state })

      if ((collideBox || collideCircle) && mouse && transform) {
        const isMouseOverFlag = isMouseOver({
          transform,
          mouse,
          collideBox,
          collideCircle,
        })

        const isMouseEnter = !component.isMouseOver && isMouseOverFlag
        const isMouseLeave = component.isMouseOver && !isMouseOverFlag
        const isClicked = component.isMouseOver && mouse.buttons === 1

        return setComponent<MouseInteraction, InternalInitialState>({
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
        })
      }

      return state
    },
  })
