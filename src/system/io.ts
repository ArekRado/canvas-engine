import { vector, vectorZero } from '@arekrado/vector-2d'
import { Keyboard, Mouse, State } from '../type'
import { createGlobalSystem, systemPriority } from './createSystem'

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

let keyboard: Keyboard = {}

export const createInitialize = (
  containerId = 'canvas-engine',
  { document }: { document: Document },
) => {
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

    document.addEventListener(
      'keydown',
      (e) => {
        keyboard[e.key] = {
          isDown: true,
          isUp: false,
          isPressed: true,
        }
      },
      false,
    )
    document.addEventListener(
      'keyup',
      (e) => {
        keyboard[e.key] = {
          isDown: false,
          isUp: true,
          isPressed: false,
        }
      },
      false,
    )

    isInitialized = true
  }
}

export const initialize = (containerId = 'canvas-engine') =>
  createInitialize(containerId, {
    document: document,
  })

export const ioSystem = (state: State) =>
  createGlobalSystem({
    name: 'io',
    state,
    priority: systemPriority.io,
    tick: ({ state }) => {
      const mouseBeforeReset: Mouse = isInitialized
        ? {
            buttons,
            position,
            lastClick,
            isButtonUp,
            isButtonDown,
            isMoving,
            wheel: { ...wheel },
          }
        : state.mouse

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

      const keyboardBeforeReset = {
        ...keyboard,
      }

      keyboard = Object.entries(keyboard).reduce((acc, [key, value]) => {
        acc[key] = {
          isDown: false,
          isUp: false,
          isPressed: value?.isPressed || false,
        }

        return acc
      }, {})

      return {
        ...state,
        mouse: mouseBeforeReset,
        keyboard: keyboardBeforeReset,
      }
    },
  })
