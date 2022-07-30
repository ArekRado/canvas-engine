import { emitEvent } from '../event'
import { AnyState, CanvasEngineEvent, RenderLoopStartEvent } from '../type'
import { runOneFrame } from './runOneFrame'

export const runRenderLoop = <State extends AnyState = AnyState>({
  state,
  windowMock = window,
}: {
  state: State
  windowMock?: Window
}) => {
  const callback = () => {
    state = runOneFrame({ state })
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
