import { componentName } from '../../component/componentName'
import {
  Collider,
  AnyState,
  Mouse,
  MouseInteraction,
  Transform,
} from '../../type'
import { createSystem } from '../createSystem'
import { Intersection } from '../collider/getIntersection'
import { mouseEntity } from '../mouse/mouse'
import { getCollider } from '../collider/colliderCrud'
import { getTransform } from '../transform/transformCrud'
import { getMouse } from '../mouse/mouseCrud'
import { updateMouseInteraction } from './mouseInteractionCrud'
import {
  CollisionDetectorNormalizer,
  collisionsMatrix,
} from '../collider/collider'
import { defaultTransform } from '../../util/defaultComponents'

type IsMouseOver = (params: {
  mouse: Mouse
  collider?: Collider
  transform: Transform
}) => Intersection | null
export const getMouseIntersection: IsMouseOver = ({
  mouse,
  collider,
  transform,
}) => {
  let intersection: Intersection | null = null
  collider?.data.forEach((colliderData) => {
    if (intersection === null) {
      const collisionDetector: CollisionDetectorNormalizer =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        collisionsMatrix['point'][colliderData.type]

      intersection = collisionDetector({
        transform1: defaultTransform({
          // position: camera.position ???
        }),
        collider1Data: {
          type: 'point',
          position: mouse.position,
        },
        transform2: transform,
        collider2Data: colliderData,
      })
    }
  })

  return intersection
}

export const mouseInteractionSystem = (state: AnyState) =>
  createSystem<MouseInteraction, AnyState>({
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
        const intersection = getMouseIntersection({
          transform,
          mouse,
          collider,
        })

        const isMouseEnter = !component.isMouseOver && intersection !== null
        const isMouseLeave = component.isMouseOver && intersection === null
        const isClicked = component.isMouseOver && mouse.buttons === 1

        return updateMouseInteraction({
          state,
          entity,
          update: () => ({
            isClicked,
            isDoubleClicked: false, // TODO
            isMouseOver: intersection !== null,
            isMouseEnter,
            isMouseLeave,
            intersection,
          }),
        })
      }

      return state
    },
  })
