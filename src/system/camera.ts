import { createSystem } from './createSystem'
import { createComponent } from '../component/createComponent'
import { componentName } from '../component/componentName'
import { Camera, ECSEvent, InternalInitialState } from '../type'
import { adjustBabylonCameraToComponentCamera } from './cameraSystem/handleResize'
import { getAspectRatio } from '../util/getAspectRatio'
import { createGetSetForUniqComponent } from '../util/createGetSetForUniqComponent'
import { setEntity } from '../entity/setEntity'

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

export const cameraSystem = (state: InternalInitialState) => {
  state = createSystem<Camera, InternalInitialState>({
    state,
    name: componentName.camera,
    componentName: componentName.camera,
    create: ({ state, component }) => {
      state = setCamera({ state, data: component })

      return state
    },
  })

  state = setEntity({
    entity: cameraEntity,
    state,
  })

  return createComponent<Camera, InternalInitialState>({
    state,
    data: {
      entity: cameraEntity,
      name: componentName.camera,
      position: [0, 0],
      distance: 1,
      bottom: 1,
      top: 1,
      left: 1,
      right: 1,
    },
  })
}
