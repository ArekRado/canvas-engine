import { createSystem } from '../createSystem'
import { componentName } from '../../component/componentName'
import { Camera, Entity, InternalInitialState } from '../../type'
import { adjustThreeCameraToComponentCamera } from './handler/handleResize'
import { createEntity } from '../../entity/createEntity'
import { createCamera, updateCamera } from './cameraCrud'
import { generateEntity } from '../../entity/generateEntity'
import { PerspectiveCamera } from 'three'

export const cameraEntity = `camera-${generateEntity()}`

export let cameraInstance: PerspectiveCamera | undefined

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
  adjustThreeCameraToComponentCamera({
    component,
    cameraInstance,
  })
  state = updateCamera({
    state,
    entity,
    update: () => ({ ...component }),
    callSystemUpdateMethod,
  }) as InternalInitialState

  return state
}

export const cameraSystem = (
  state: InternalInitialState,
): InternalInitialState => {
  state = createSystem<Camera, InternalInitialState>({
    state,
    name: componentName.camera,
    componentName: componentName.camera,
    create: ({ state, component, entity }) => {
      cameraInstance = new PerspectiveCamera(
        component.fov,
        component.aspect,
        component.near,
        component.far,
      )

      state = update({ state, component, entity, callSystemUpdateMethod: true })

      return state
    },
    update: ({ state, component, entity }) => {
      state = update({
        state,
        component,
        entity,
        callSystemUpdateMethod: false,
      })

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
      position: [0, 0, 0],
      lookAt: [1, 1, 1],
      fov: 90,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 1000,
    },
  }) as InternalInitialState
}
