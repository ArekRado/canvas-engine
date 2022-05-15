import { componentName } from '../../../component/componentName'
import { updateComponent } from '../../../component/updateComponent'
import {
  AnyState,
  Camera,
  EventHandler,
  InternalInitialState,
} from '../../../type'
import { cameraEntity, CameraEvent } from '../camera'

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
  Vector3,
}: {
  component: Partial<Camera>
  aspectRatio: number
  cameraRef: AnyState['babylonjs']['cameraRef']
  Vector3: any
}) => {
  if (!cameraRef) return

  if (component.position) {
    cameraRef.position.x = component.position[1]
    cameraRef.position.y = component.position[0]
    cameraRef.position.z = -10
    if (process.env.NODE_ENV === 'development' && Vector3) {
      cameraRef.setTarget(
        new Vector3(component.position[1], component.position[0], 0),
      )
    }
  }

  const size = getCameraSize(component.distance ?? 0, aspectRatio)

  cameraRef.orthoLeft = size.left
  cameraRef.orthoRight = size.right
  cameraRef.orthoBottom = size.bottom
  cameraRef.orthoTop = size.top

  return size
}

export const handleResize: EventHandler<
  CameraEvent.ResizeEvent,
  InternalInitialState
> = ({ state }) => {
  state = updateComponent<Camera, InternalInitialState>({
    state,
    name: componentName.camera,
    entity: cameraEntity,
    update: () => ({}),
  })

  return state
}
