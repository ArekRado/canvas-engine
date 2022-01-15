import { InternalInitialState } from '..'
import { CameraEvent } from '../system/cameraSystem'
import { handleResize } from './cameraSystem/handleResize'

export type AllEvents = CameraEvent.All

export const internalEventHandler = <AllEvents2>({
  state,
  event,
}: {
  state: InternalInitialState
  event: AllEvents2 & AllEvents
}): InternalInitialState => {
  switch (event.type) {
    // // Camera
    case CameraEvent.Type.resize:
      state = handleResize({ state, event })
      break
  }
  return state
}
