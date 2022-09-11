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

export const adjustBabylonCameraToComponentCamera = ({
  component,
  aspectRatio,
  cameraRef,
}: {
  component: Partial<Camera>
  aspectRatio: number
  cameraRef: AnyState['babylonjs']['cameraRef']
}) => {
  if (!cameraRef) return

  if (component.position) {
    cameraRef.position.x = component.position[1];
    cameraRef.position.y = component.position[0];
    cameraRef.position.z = -10;

    cameraRef.target.x = component.position[1];
    cameraRef.target.y = component.position[0];
    cameraRef.target.z = 0;
  }

  const size = getCameraSize(component.distance ?? 0, aspectRatio)

  cameraRef.orthoLeft = size.left
  cameraRef.orthoRight = size.right
  cameraRef.orthoBottom = size.bottom
  cameraRef.orthoTop = size.top

  return size
}

export const handleResize: EventHandler<
  WindowResizeEvent,
  AnyState
> = ({ state }) => {
  state = updateCamera({
    state,
    entity: cameraEntity,
    update: () => ({}),
  })

  return state
}
