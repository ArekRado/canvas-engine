import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Camera, EventHandler, State } from '../../type'
import { CameraEvent, getCamera, setCamera } from '../cameraSystem'
import { getCameraSize } from './getCameraSize'

export const adjustBabylonCameraToComponentCamera = ({
  component,
  aspectRatio,
  cameraRef,
}: {
  component: Partial<Camera>
  aspectRatio: number
  cameraRef: State['babylonjs']['cameraRef']
}) => {
  if (!cameraRef) return

  if (component.position) {
    cameraRef.position.x = component.position[1]
    cameraRef.position.y = component.position[0]
    cameraRef.position.z = -10
    cameraRef.setTarget({
      x: component.position[1],
      y: component.position[0],
      z: 0,
    } as Vector3)
  }

  const size = getCameraSize(component.distance ?? 0, aspectRatio)

  cameraRef.orthoLeft = size.left
  cameraRef.orthoRight = size.right
  cameraRef.orthoBottom = size.bottom
  cameraRef.orthoTop = size.top

  return size
}

export const handleResize: EventHandler<CameraEvent.ResizeEvent> = ({
  state,
}) => {
  const camera = getCamera({ state })

  state = setCamera({
    state,
    data: camera || {},
  })

  return state
}