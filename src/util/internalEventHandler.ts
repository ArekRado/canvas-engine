import { handleResize } from '../system/camera/handler/handleResize'
import { AllEvents, CanvasEngineEvent, AnyState } from '../type'

export const internalEventHandler = <AllEvents2>({
  state,
  event,
}: {
  state: AnyState
  event: AllEvents2 & AllEvents
}): AnyState => {
  switch (event.type) {
    // Camera
    case CanvasEngineEvent.windowResize:
      state = handleResize({ state, event })
      break

    // todo add util event handlers 
    // eg handleRemoveComponent, handleSetComponent
  }
  return state
}
