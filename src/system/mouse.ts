import { vector, vectorZero } from '@arekrado/vector-2d'
import { componentName, createSystem, setComponent } from '..'
import { createGetSetForUniqComponent } from '../component'
import { Mouse, State } from '../type'
import { mouse } from '../util/defaultComponents'
import { systemPriority } from './createSystem'

const mouseEntity = 'mouseEntity'

const mouseGetSet = createGetSetForUniqComponent<Mouse>({
  entity: mouseEntity,
  name: componentName.mouse,
})

export const getMouse = mouseGetSet.getComponent
export const setMouse = mouseGetSet.setComponent

let buttons = 0
let position = vectorZero()
let lastClick = {
  timestamp: -1,
  buttons: 0,
}
let isMoving = false
let isButtonUp = false
let isButtonDown = false
let isInitialized = false

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
  state: State
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

    isInitialized = true
  }

  state = setComponent<Mouse>({
    state,
    data: mouse({
      entity: mouseEntity,
    }),
  })

  return createSystem({
    name: componentName.mouse,
    state,
    priority: systemPriority.mouse,
    tick: ({ state }) => {
      const mouseBeforeReset: Mouse = {
        buttons,
        position,
        lastClick,
        isButtonUp,
        isButtonDown,
        isMoving,
        wheel: { ...wheel },
      }

      state = setMouse({
        state,
        data: mouseBeforeReset,
      })

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

      return state
    },
  })
}
