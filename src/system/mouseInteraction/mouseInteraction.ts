import { add } from '@arekrado/vector-2d'
import { componentName } from '../../component/componentName'
import {
  Collider,
  InternalInitialState,
  Mouse,
  MouseInteraction,
  Transform,
} from '../../type'
import { createSystem } from '../createSystem'
import {
  detectPointRectangleCollision,
  detectPointCircleCollision,
} from '../collider/detectCollision'
import { parseV3ToV2 } from '../../util/parseV3ToV2'
import { mouseEntity } from '../mouse/mouse'
import { getCollider } from '../collider/colliderCrud'
import { getTransform } from '../transform/transformCrud'
import { getMouse } from '../mouse/mouseCrud'
import { updateMouseInteraction } from './mouseInteractionCrud'

type IsMouseOver = (params: {
  mouse: Mouse
  collider?: Collider
  transform: Transform
}) => boolean
export const isMouseOver: IsMouseOver = ({ mouse, collider, transform }) => {
  let hasCollision = false
  collider?.data.forEach((colliderData) => {
    if (!hasCollision && colliderData.type === 'rectangle') {
      hasCollision = detectPointRectangleCollision({
        point: mouse.position,
        rectangle: {
          position: add(parseV3ToV2(transform.position), colliderData.position),
          size: colliderData.size,
        },
      })
    }

    if (!hasCollision && colliderData.type === 'circle') {
      hasCollision = detectPointCircleCollision({
        point: mouse.position,
        circle: {
          position: add(parseV3ToV2(transform.position), colliderData.position),
          radius: colliderData.radius,
        },
      })
    }
  })

  return hasCollision
}

export const mouseInteractionSystem = (state: InternalInitialState) =>
  createSystem<MouseInteraction, InternalInitialState>({
    state,
    name: componentName.mouseInteraction,
    componentName: componentName.mouseInteraction,
    create: ({ state }) => state,
    remove: ({ state }) => state,
    tick: ({ state, component, entity }) => {
      // todo rewrite it to set/getMouseInteraction
      // set mouse interaction on mouse move events

      const collider = getCollider({
        state,
        entity,
      })
      const transform = getTransform({
        state,
        entity,
      })

      const mouse = getMouse({
        state,
        entity: mouseEntity,
      })

      if (collider && mouse && transform) {
        const isMouseOverFlag = isMouseOver({
          transform,
          mouse,
          collider,
        })

        const isMouseEnter = !component.isMouseOver && isMouseOverFlag
        const isMouseLeave = component.isMouseOver && !isMouseOverFlag
        const isClicked = component.isMouseOver && mouse.buttons === 1

        return updateMouseInteraction({
          state,
          entity,
          update: () => ({
            isClicked,
            isDoubleClicked: false, // TODO
            isMouseOver: isMouseOverFlag,
            isMouseEnter,
            isMouseLeave,
          }),
        })
      }

      return state
    },
  })
