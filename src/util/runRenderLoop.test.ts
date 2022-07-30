import { CanvasEngineEvent, getState } from '..'
import { addEventHandler } from '../event'
import { runRenderLoop } from './runRenderLoop'

describe('runRenderLoop', () => {
  it('should emit event on start', () => {
    const eventHandlerMock = jest.fn()

    addEventHandler(({ state, event }) => {
      eventHandlerMock(event)
      return state
    })

    const callbacks: FrameRequestCallback[] = []

    const requestAnimationFrame = (callback: FrameRequestCallback) => {
      callbacks.push(callback)
      return 0
    }

    runRenderLoop({
      state: getState({}),
      windowMock: { requestAnimationFrame } as unknown as Window,
    })

    callbacks.forEach((callback) => {
      callback(0)
    })

    expect(eventHandlerMock.mock.calls[0][0]).toEqual({
      payload: {
        animationFrame: 0,
      },
      type: CanvasEngineEvent.renderLoopStart,
    })
  })
})
