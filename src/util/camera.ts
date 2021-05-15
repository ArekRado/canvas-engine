import { camera as cameraDraw } from '../draw/camera'
import { Camera, State } from '../type'

type SetCamera = (params: { state: State; camera: Camera }) => State
export const setCamera: SetCamera = ({ state, camera }) => {
  cameraDraw(camera)

  return {
    ...state,
    camera,
  }
}
