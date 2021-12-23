import { State } from '../../type'
import { getCamera } from '../cameraSystem'

export const getCameraSizes = ({ state }: { state: State }) => {
  const camera = getCamera({ state })

  if (camera) {
    const leftEdge = camera.position[0] + camera.left
    const topEdge = camera.position[1] + camera.top
    const screenSize = [camera.right * 2, camera.top * 2]

    return {
      leftEdge,
      topEdge,
      screenSize,
    }
  }
  return {
    leftEdge: 0,
    topEdge: 0,
    screenSize: [0, 0],
  }
}
