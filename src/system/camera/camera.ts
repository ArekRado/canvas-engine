import { createSystem } from '../createSystem'
import { createComponent } from '../../component/createComponent'
import { updateComponent } from '../../component/updateComponent'
import { componentName } from '../../component/componentName'
import { Camera, ECSEvent, Entity, InternalInitialState } from '../../type'
import { adjustBabylonCameraToComponentCamera } from './handler/handleResize'
import { getAspectRatio } from '../../util/getAspectRatio'
import { createEntity } from '../../entity/createEntity'

export const cameraEntity = 'camera'
export namespace CameraEvent {
  export enum Type {
    resize = 'CameraEvent-resize',
  }

  export type All = ResizeEvent

  export type ResizeEvent = ECSEvent<Type.resize, null>
}

const update = ({
  state,
  component,
  entity,
  name,
}: {
  state: InternalInitialState
  component: Partial<Camera>
  entity: Entity
  name: string
}): typeof state => {
  if (
    state.babylonjs.sceneRef &&
    state.babylonjs.Vector3 &&
    state.babylonjs.cameraRef
  ) {
    const size = adjustBabylonCameraToComponentCamera({
      component,
      aspectRatio: getAspectRatio(state.babylonjs.sceneRef),
      cameraRef: state.babylonjs.cameraRef,
      Vector3: state.babylonjs.Vector3,
    })
    state = updateComponent<Camera, InternalInitialState>({
      state,
      entity,
      name,
      update: () => ({ ...component, ...size }),
    })
  }

  return state
}

export const cameraSystem = (state: InternalInitialState) => {
  state = createSystem<Camera, InternalInitialState>({
    state,
    name: componentName.camera,
    componentName: componentName.camera,
    update: ({ state, component, entity, name }) => {
      state = update({ state, component, entity, name })

      return state
    },
    create: ({ state, component, entity, name }) => {
      state = update({ state, component, entity, name })

      return state
    },
  })

  state = createEntity({
    entity: cameraEntity,
    state,
  })

  return createComponent<Camera, InternalInitialState>({
    state,
    entity: cameraEntity,
    name: componentName.camera,
    data: {
      position: [0, 0],
      distance: 1,
      bottom: 1,
      top: 1,
      left: 1,
      right: 1,
    },
  })
}
