import { PerspectiveCamera } from 'three'
import {
  AnyState,
  Camera,
  EventHandler,
  WindowResizeEvent,
} from '../../../type'
import { cameraEntity } from '../camera'
import { updateCamera } from '../cameraCrud'

export const getCameraSize = (distance: number, aspectRatio: number) => {
  if (aspectRatio > 1) {
    return {
      left: -distance,
      right: distance,
      bottom: -distance * aspectRatio,
      top: distance * aspectRatio,
    }
  } else {
    return {
      bottom: -distance,
      top: distance,
      left: -distance / aspectRatio,
      right: distance / aspectRatio,
    }
  }
}

export const adjustThreeCameraToComponentCamera = ({
  component,
  // aspectRatio,
  cameraInstance,
}: {
  component: Partial<Camera>
  // aspectRatio: number
  cameraInstance: PerspectiveCamera | undefined
}) => {
  if (!cameraInstance) return

  if (component.position) {
    cameraInstance.position.x = component.position[0]
    cameraInstance.position.y = component.position[1]
    cameraInstance.position.z = component.position[2]
  }

  if (component.lookAt) {
    cameraInstance.lookAt(
      component.lookAt[0],
      component.lookAt[1],
      component.lookAt[2],
    )

    // cameraInstance.target.x = component.position[1];
    // cameraInstance.target.y = component.position[0];
    // cameraInstance.target.z = 0;
  }

  if (component.fov !== undefined) cameraInstance.fov = component.fov
  if (component.aspect !== undefined) cameraInstance.aspect = component.aspect
  if (component.near !== undefined) cameraInstance.near = component.near
  if (component.far !== undefined) cameraInstance.far = component.far

  // const size = getCameraSize(component.distance ?? 0, aspectRatio)

  // cameraInstance.orthoLeft = size.left
  // cameraInstance.orthoRight = size.right
  // cameraInstance.orthoBottom = size.bottom
  // cameraInstance.orthoTop = size.top

  // return size
}

export const handleResize: EventHandler<WindowResizeEvent, AnyState> = ({
  state,
}) => {
  state = updateCamera({
    state,
    entity: cameraEntity,
    update: () => ({}),
  })

  return state
}
