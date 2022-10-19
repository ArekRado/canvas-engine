import { emitEvent } from '../event'
import { cameraInstance } from '../system/camera/camera'
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

  const rendererRef = state.three.rendererRef
  const sceneRef = state.three.sceneRef

  if (rendererRef && sceneRef && cameraInstance) {
    rendererRef.render(sceneRef, cameraInstance)
  }

  emitEvent<RenderLoopStartEvent>({
    type: CanvasEngineEvent.renderLoopStart,
    payload: {
      animationFrame: state.animationFrame,
    },
  })
}
