import { createSystem } from '../system/createSystem'
import { componentName, createGetSetForUniqComponent } from '../component'
import { Camera, State } from '../type'
import { adjustBabylonCameraToComponentCamera } from './cameraSystem/handleResize'
import { ECSEvent } from './createEventSystem'
import { getAspectRatio } from '../util/getAspectRatio'

export const cameraEntity = 'cameraEntity'
export namespace CameraEvent {
  export enum Type {
    resize = 'CameraEvent-resize',
  }

  export type All = ResizeEvent

  export type ResizeEvent = ECSEvent<Type.resize, {}>
}

const cameraGetSet = createGetSetForUniqComponent<Camera>({
  entity: cameraEntity,
  name: componentName.camera,
})

export const getCamera = cameraGetSet.getComponent
export const setCamera = ({
  state,
  data,
}: {
  state: State
  data: Partial<Camera>
}) => {
  if (state.babylonjs.sceneRef) {
    const size = adjustBabylonCameraToComponentCamera({
      component: data,
      aspectRatio: getAspectRatio(state.babylonjs.sceneRef),
      cameraRef: state.babylonjs.cameraRef,
    })
    state = cameraGetSet.setComponent({ state, data: { ...data, ...size } })
  }

  // state = setBackground({ state, data: {} });
  // state = setLogo({ state, data: {} });

  return state
}

export const cameraSystem = (state: State) =>
  createSystem<Camera>({
    state,
    name: componentName.camera,
    create: ({ state, component }) => {
      state = setCamera({ state, data: component })

      return state
    },
  })
