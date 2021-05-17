import { camera as cameraDraw } from '../draw/camera'
import { Camera, State } from '../type'

type SetCamera = (params: { state: State; camera: Camera }) => State
export const setCamera: SetCamera = ({ state, camera }) => {
  state.regl && cameraDraw({ camera, regl: state.regl })

  return {
    ...state,
    camera,
  }
}
