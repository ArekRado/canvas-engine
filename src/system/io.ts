import { vector, vectorZero } from '@arekrado/vector-2d'
import { Mouse, State } from '../type'
import { createGlobalSystem } from './createSystem'

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
    tick: ({ state }) => {
      const mouseBeforeReset: Mouse = isInitialized
        ? {
            buttons,
            position,
            lastClick,
            isButtonUp,
            isButtonDown,
            isMoving,
          }
        : state.mouse

      buttons = 0
      isButtonUp = false
      isButtonDown = false
      isMoving = false

      return {
        ...state,
        mouse: mouseBeforeReset,
      }
    },
  })
