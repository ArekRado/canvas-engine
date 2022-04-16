import { CameraEvent } from '../system/camera/camera'
import { handleResize } from '../system/camera/handler/handleResize'
import { InternalInitialState } from '../type'

export type AllEvents = CameraEvent.All

export const internalEventHandler = <AllEvents2>({
  state,
  event,
}: {
  state: InternalInitialState
  event: AllEvents2 & AllEvents
}): InternalInitialState => {
  switch (event.type) {
    // Camera
    case CameraEvent.Type.resize:
      state = handleResize({ state, event })
      break

    // todo add util event handlers 
    // eg handleRemoveComponent, handleSetComponent
  }
  return state
}
