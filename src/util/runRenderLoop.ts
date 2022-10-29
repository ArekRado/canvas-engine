import { emitEvent } from '../event'
import { cameraInstance } from '../system/camera/camera'
import { AnyState, CanvasEngineEvent, RenderLoopStartEvent } from '../type'
import { runOneFrame } from './runOneFrame'
import { scene, renderer } from './state'

export const runRenderLoop = <State extends AnyState = AnyState>({
  state,
  windowMock = window,
}: {
  state: State
  windowMock?: Window
}) => {
  const callback = () => {
    const sceneRef = scene().get()
    const rendererRef = renderer().get()
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
