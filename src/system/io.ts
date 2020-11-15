import { vector, vectorZero } from '@arekrado/vector-2d'
import { State } from '../main'

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

type Update = (params: { state: State }) => State
export const update: Update = ({ state }) => ({
  ...state,
  mouse: {
    buttons,
    position,
  },
})
