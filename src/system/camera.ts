import { createSystem } from './createSystem'
import { componentName, createGetSetForUniqComponent } from '../component'
import { Camera, InternalInitialState } from '../type'
import { adjustBabylonCameraToComponentCamera } from '../event/cameraSystem/handleResize'
import { ECSEvent } from '../event/createEventSystem'
import { getAspectRatio } from '../util/getAspectRatio'

export const cameraEntity = 'cameraEntity'
export namespace CameraEvent {
  export enum Type {
    resize = 'CameraEvent-resize',
  }

  export type All = ResizeEvent

  export type ResizeEvent = ECSEvent<Type.resize, {}>
}

const cameraGetSet = createGetSetForUniqComponent<Camera, InternalInitialState>(
  {
    entity: cameraEntity,
    name: componentName.camera,
  },
)

export const getCamera = cameraGetSet.getComponent
export const setCamera = ({
  state,
  data,
}: {
  state: InternalInitialState
  data: Partial<Camera>
}): typeof state => {
  if (
    state.babylonjs.sceneRef &&
    state.babylonjs.Vector3 &&
    state.babylonjs.cameraRef
  ) {
    const size = adjustBabylonCameraToComponentCamera({
      component: data,
      aspectRatio: getAspectRatio(state.babylonjs.sceneRef),
      cameraRef: state.babylonjs.cameraRef,
      Vector3: state.babylonjs.Vector3,
    })
    state = cameraGetSet.setComponent({ state, data: { ...data, ...size } })
  }

  return state
}

export const cameraSystem = (state: InternalInitialState) =>
  createSystem<Camera, InternalInitialState>({
    state,
    name: componentName.camera,
    componentName: componentName.camera,
    create: ({ state, component }) => {
      state = setCamera({ state, data: component })

      return state
    },
  })
