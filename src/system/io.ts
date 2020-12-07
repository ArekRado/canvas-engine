import { vector, vectorZero } from '@arekrado/vector-2d'
import { State } from '../type'
import { createSystem } from './createSystem'

let buttons = 0
let position = vectorZero()

export const initialize = (containerId = 'canvas-engine') => {
  const container = document.getElementById(containerId)

  if (container) {
    const containerPosition = container.getBoundingClientRect()

    const setMousePosition = (e: MouseEvent) => {
      position = vector(
        e.pageX - containerPosition.left,
        e.pageY - containerPosition.top,
      )
    }

    container.addEventListener('click', (e) => {
      buttons = e.buttons
    })
    container.addEventListener('mousemove', setMousePosition, false)
    container.addEventListener('mouseenter', setMousePosition, false)
    container.addEventListener('mouseleave', setMousePosition, false)
  }
}

export const ioSystem = (state: State) =>
  createSystem({
    name: 'io',
    state,
    tick: ({ state }) => ({
      ...state,
      mouse: {
        buttons,
        position,
      },
    }),
  })
