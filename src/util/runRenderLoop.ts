import { emitEvent } from '../event'
import { cameraInstance } from '../system/camera/camera'
import { AnyState, CanvasEngineEvent, RenderLoopStartEvent } from '../type'
import { runOneFrame } from './runOneFrame'
import { getScene, getRenderer } from './state'

export const runRenderLoop = <State extends AnyState = AnyState>({
  state,
  windowMock = window,
}: {
  state: State
  windowMock?: Window
}) => {
  const callback = () => {
    const sceneRef = getScene()
    const rendererRef = getRenderer()
    if (rendererRef && sceneRef && cameraInstance) {
      state = runOneFrame({ state })
      rendererRef.render(sceneRef, cameraInstance)
    }

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
