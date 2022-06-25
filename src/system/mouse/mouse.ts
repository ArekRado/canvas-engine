import { vector, vectorZero } from '@arekrado/vector-2d'
import { InternalInitialState, Mouse } from '../../type'
import { defaultMouse } from '../../util/defaultComponents'
import { createSystem, systemPriority } from '../createSystem'
import { componentName } from '../../component/componentName'
import { createMouse, updateMouse } from './mouseCrud'

export const mouseEntity = 'mouse'

let buttons = 0
let position = vectorZero()
let lastClick = {
  timestamp: -1,
  buttons: 0,
}
let isMoving = false
let isButtonUp = false
let isButtonDown = false

let wheel = {
  deltaMode: 0,
  deltaX: 0,
  deltaY: 0,
  deltaZ: 0,
}

export const mouseSystem = ({
  state,
  containerId,
  document,
}: {
  state: InternalInitialState
  document: Document
  containerId: string
}) => {
  const container = document.getElementById(containerId)

  if (container) {
    const containerPosition = container.getBoundingClientRect()

    const setMousePosition = (e: MouseEvent) => {
      position = vector(
        e.pageX - containerPosition.left,
        e.pageY - containerPosition.top,
      )
    }

    container.addEventListener(
      'mousemove',
      (e: MouseEvent) => {
        setMousePosition(e)
        isMoving = true
      },
      false,
    )
    container.addEventListener('mouseenter', setMousePosition, false)
    container.addEventListener('mouseleave', setMousePosition, false)

    container.addEventListener(
      'mouseup',
      () => {
        isButtonUp = true
      },
      false,
    )
    container.addEventListener(
      'mousedown',
      (e) => {
        isButtonDown = true

        buttons = e.buttons
        lastClick = {
          timestamp: Date.now(),
          buttons: e.buttons,
        }
      },
      false,
    )
    container.addEventListener('wheel', (e) => {
      wheel = {
        deltaMode: e.deltaMode,
        deltaX: e.deltaX,
        deltaY: e.deltaY,
        deltaZ: e.deltaZ,
      }
    })
  }

  state = createMouse({
    state,
    entity: mouseEntity,
    data: defaultMouse(),
  })

  return createSystem({
    name: componentName.mouse,
    componentName: componentName.mouse,
    state,
    priority: systemPriority.mouse,
    tick: ({ state, entity }) => {
      const mouseBeforeReset: Mouse = {
        buttons,
        position,
        lastClick,
        isButtonUp,
        isButtonDown,
        isMoving,
        wheel: { ...wheel },
      }

      buttons = 0
      isButtonUp = false
      isButtonDown = false
      isMoving = false
      wheel = {
        deltaMode: 0,
        deltaX: 0,
        deltaY: 0,
        deltaZ: 0,
      }

      state = updateMouse({
        state,
        entity,
        update: () => mouseBeforeReset,
      })

      return state
    },
  })
}
