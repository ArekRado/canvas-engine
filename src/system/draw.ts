import { State } from '../main'
import { Sprite, Transform } from '../component'
import { initialize as initializePixi, render } from '../util/pixiDraw'

export type DrawState = {
  sprite: Sprite
  transform: Transform
}

export const initialize = initializePixi

type Update = (params: { state: State; enableDraw: boolean }) => State
export const update: Update = ({ state, enableDraw }) => {
  if (enableDraw) {
    const drawState: DrawState[] = []

    Object.keys(state.component.sprite).forEach((key) => {
      const sprite = state.component.sprite[key]
      const transform = state.component.transform[key]

      if (sprite && transform) {
        drawState.push({
          sprite,
          transform,
        })
      }
    })

    render(drawState, false)
  }

  return state
}
