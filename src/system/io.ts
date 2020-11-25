import { vector, vectorZero } from '@arekrado/vector-2d'
import { State } from '../type'
import { createSystem } from './createSystem'

let buttons = 0
let position = vectorZero()

export const initialize = () => {
  const body = document.body

  if (body) {
    const setMousePosition = (e: MouseEvent) => {
      position = vector(e.pageX, e.pageY)
    }

    body.addEventListener('click', (e) => {
      buttons = e.buttons
    })
    body.addEventListener('mousemove', setMousePosition, false)
    body.addEventListener('mouseenter', setMousePosition, false)
    body.addEventListener('mouseleave', setMousePosition, false)
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
