import { emitEvent } from '../event'
import { AnyState, CanvasEngineEvent, RenderLoopStartEvent } from '../type'

export const runRenderLoop = <State extends AnyState = AnyState>({
  state,
  windowMock = window,
}: {
  state: State
  windowMock?: Window
}) => {
  const callback = () => {
    state.animationFrame = windowMock.requestAnimationFrame(callback)
  }

  state.animationFrame = windowMock.requestAnimationFrame(callback)

  emitEvent<RenderLoopStartEvent>({
    type: CanvasEngineEvent.renderLoopStart,
    payload: {
      animationFrame: state.animationFrame,
    },
  })
}
