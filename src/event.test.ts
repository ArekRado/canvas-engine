import { createEntity } from './entity/createEntity'
import { createComponent } from './component/createComponent'
import { getComponent } from './component/getComponent'
import { updateComponent } from './component/updateComponent'
import { generateEntity } from './entity/generateEntity'
import { CameraEvent } from './system/camera/camera'
import { addEventHandler, emitEvent, removeEventHandler } from './event'
import { ECSEvent, InternalInitialState } from './type'
import { runOneFrame } from './util/runOneFrame'
import { getState } from './util/state'

describe('event', () => {
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

    removeEventHandler(eventHandler)

    emitEvent(event)
    state = runOneFrame({ state })

    expect(eventHandler).toHaveBeenCalledTimes(1)
  })

  it('should handle internal events emmited from external functions', () => {
    const event: CameraEvent.ResizeEvent = {
      type: CameraEvent.Type.resize,
      payload: null,
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

  it('should handle deeply nested events', () => {
    type Test = { count: number }
    const name = 'test'
    const event: CameraEvent.ResizeEvent = {
      type: CameraEvent.Type.resize,
      payload: null,
    }
    const entity = generateEntity()

    let state = createEntity({ state: getState({}), entity })

    state = createComponent<Test, InternalInitialState>({
      state,
      name,
      entity,
      data: {
        count: 0,
      },
    })

    const eventHandler = jest.fn(({ state }) => {
      emitEvent(event)

      return updateComponent<Test, InternalInitialState>({
        state,
        entity,
        name,
        update: ({ count }) => ({ count: count + 1 }),
      })
    })

    addEventHandler(eventHandler)

    expect(eventHandler).not.toHaveBeenCalled()

    emitEvent(event)

    Array.from({ length: 6 }).forEach((_, i) => {
      state = runOneFrame({ state })
      expect(getComponent<Test>({ state, name, entity })?.count).toEqual(i + 1)
    })
  })
})
