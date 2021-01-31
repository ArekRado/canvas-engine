import { Camera } from '../type'
import { initialize as initializePixi, setCamera } from '../util/pixiDraw'
import { createSystem } from './createSystem'
import { State } from '../type'
import { componentName } from '../component'

export const initialize = initializePixi

export const cameraSystem = (state: State) =>
  createSystem<Camera>({
    state,
    name: componentName.camera,
    create: ({ state, component }) => {
      if (state.isDrawEnabled) {
        setCamera(component)
      }

      return state
    },
    tick: ({ state, component }) => {
      if (state.isDrawEnabled) {
        setCamera(component)
      }

      return state
    },
  })
