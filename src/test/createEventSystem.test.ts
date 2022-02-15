import 'regenerator-runtime/runtime'
import { ECSEvent, runOneFrame } from '..'
import { CameraEvent } from '../system/camera'
import { addEventHandler, emitEvent, removeEventHandler } from '../system/event'
import { getState } from '../util/state'

describe('createEventSystem', () => {
  it('should emit, receive events and add, remove event handlers', () => {
    const event: ECSEvent<string, string> = {
      type: 'example',
      payload: 'payload',
    }
    const eventHandler = jest.fn(({ state }) => state)

    addEventHandler(eventHandler)

    expect(eventHandler).not.toHaveBeenCalled()

    let state = getState({})

    emitEvent(event)

    expect(eventHandler).not.toHaveBeenCalled()

    state = runOneFrame({ state })

    expect(eventHandler).toHaveBeenCalledTimes(1)
    expect(Object.keys(eventHandler.mock.calls[0][0])).toEqual([
      'state',
      'event',
    ])
    expect(eventHandler.mock.calls[0][0].event).toEqual(event)

    removeEventHandler(eventHandler);

    emitEvent(event)
    state = runOneFrame({ state })

    expect(eventHandler).toHaveBeenCalledTimes(1)
  })

  it('should handle internal events emmited from external functions', () => {
    const event: CameraEvent.ResizeEvent = {
      type: CameraEvent.Type.resize,
      payload: {},
    }
    const eventHandler = jest.fn(({ state }) => state)
    const internalEventHandler = jest.fn(({ state }) => state)

    addEventHandler(eventHandler)
    addEventHandler(internalEventHandler)

    expect(eventHandler).not.toHaveBeenCalled()

    let state = getState({})

    emitEvent(event)

    expect(internalEventHandler).not.toHaveBeenCalled()

    state = runOneFrame({ state })

    expect(internalEventHandler).toHaveBeenCalled()
    expect(Object.keys(internalEventHandler.mock.calls[0][0])).toEqual([
      'state',
      'event',
    ])
    expect(internalEventHandler.mock.calls[0][0].event).toEqual(event)
  })
})
