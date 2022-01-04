import 'regenerator-runtime/runtime'
import { runOneFrame } from '..'
import { createEventSystem } from '../system/createEventSystem'
import { getState } from '../util/state'

describe('createEventSystem', () => {
  it('should emit and receive events', () => {
    const event = {
      type: 'example',
      payload: 'payload',
    }
    const eventHandler = jest.fn(({ state }) => state)
    const { emitEvent, eventSystem } = createEventSystem(eventHandler)

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
})
