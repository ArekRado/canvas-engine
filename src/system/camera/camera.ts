import { createSystem } from '../createSystem'
import { componentName } from '../../component/componentName'
import { Camera, Entity, InternalInitialState } from '../../type'
import { adjustBabylonCameraToComponentCamera } from './handler/handleResize'
import { getAspectRatio } from '../../util/getAspectRatio'
import { createEntity } from '../../entity/createEntity'
import { createCamera, updateCamera } from './cameraCrud'
import { generateEntity } from '../../entity/generateEntity'

export const cameraEntity = generateEntity()

const update = ({
  state,
  component,
  entity,
  callSystemUpdateMethod,
}: {
  state: InternalInitialState
  component: Partial<Camera>
  entity: Entity
  callSystemUpdateMethod: boolean
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
    state = updateCamera({
      state,
      entity,
      update: () => ({ ...component, ...size }),
      callSystemUpdateMethod,
    }) as InternalInitialState
  }

  return state
}

export const cameraSystem = (
  state: InternalInitialState,
): InternalInitialState => {
  state = createSystem<Camera, InternalInitialState>({
    state,
    name: componentName.camera,
    componentName: componentName.camera,
    update: ({ state, component, entity }) => {
      state = update({
        state,
        component,
        entity,
        callSystemUpdateMethod: false,
      })

      return state
    },
    create: ({ state, component, entity }) => {
      state = update({ state, component, entity, callSystemUpdateMethod: true })

      return state
    },
  })

  state = createEntity({
    entity: cameraEntity,
    state,
  })

  return createCamera({
    state,
    entity: cameraEntity,
    data: {
      position: [0, 0],
      distance: 1,
      bottom: 1,
      top: 1,
      left: 1,
      right: 1,
    },
  }) as InternalInitialState
}
