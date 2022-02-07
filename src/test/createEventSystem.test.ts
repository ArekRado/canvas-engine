import 'regenerator-runtime/runtime'
import { ECSEvent, runOneFrame } from '..'
import { CameraEvent } from '../system/camera'
import { createEventSystem } from '../event/createEventSystem'
import { getState } from '../util/state'

describe('createEventSystem', () => {
  it('should emit and receive events', () => {
    const event: ECSEvent<string, string> = {
      type: 'example',
      payload: 'payload',
    }
    const eventHandler = jest.fn(({ state }) => state)
    const { emitEvent, eventSystem } = createEventSystem({ eventHandler })

    expect(eventHandler).not.toHaveBeenCalled()

    let state = eventSystem(getState({}))

    emitEvent(event)

    expect(eventHandler).not.toHaveBeenCalled()

    state = runOneFrame({ state })

    expect(eventHandler).toHaveBeenCalled()
    expect(Object.keys(eventHandler.mock.calls[0][0])).toEqual([
      'state',
      'event',
    ])
    expect(eventHandler.mock.calls[0][0].event).toEqual(event)
  })

  it('should handle internal events emmited from external functions', () => {
    const event: CameraEvent.ResizeEvent = {
      type: CameraEvent.Type.resize,
      payload: {},
    }
    const eventHandler = jest.fn(({ state }) => state)
    const internalEventHandler = jest.fn(({ state }) => state)

    const { emitEvent, eventSystem } = createEventSystem({
      eventHandler,
      _internalEventHandler: internalEventHandler,
    })

    expect(eventHandler).not.toHaveBeenCalled()

    let state = eventSystem(getState({}))

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
