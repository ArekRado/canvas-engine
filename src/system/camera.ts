import { Camera } from '../type'
import { createSystem } from './createSystem'
import { State } from '../type'
import { componentName } from '../component'
import { camera } from '../draw/camera'

export const cameraSystem = (state: State) =>
  createSystem<Camera>({
    state,
    name: componentName.camera,
    create: ({ state, component }) => {
      if (state.isDrawEnabled) {
        camera(component)
      }

      return state
    },
    tick: ({ state }) => {
      if (state.isDrawEnabled) {
        // setCamera(component)
      }

      return state
    },
  })
