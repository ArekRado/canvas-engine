import { createEntity } from './entity/createEntity'
import { createComponent } from './component/createComponent'
import { getComponent } from './component/getComponent'
import { updateComponent } from './component/updateComponent'
import { generateEntity } from './entity/generateEntity'
import { addEventHandler, emitEvent, removeEventHandler } from './event'
import {
  CanvasEngineEvent,
  ECSEvent,
  InitialState,
  WindowResizeEvent,
} from './type'
import { runOneFrame } from './util/runOneFrame'
import { getInitialStateWithSystems } from './util/state'
import { vi, describe, it, expect } from 'vitest'

describe('event', () => {
  it('should emit, receive events and add, remove event handlers', () => {
    let state = getInitialStateWithSystems()

    const event: ECSEvent<string, string> = {
      type: 'example',
      payload: 'payload',
    }
    const eventHandler = vi.fn(({ state }) => state)
    addEventHandler<typeof event>(event.type, eventHandler)

    expect(eventHandler).not.toHaveBeenCalled()

    emitEvent(event)

    expect(eventHandler).not.toHaveBeenCalled()

    state = runOneFrame({ state })

    expect(eventHandler).toHaveBeenCalledTimes(1)
    expect(Object.keys(eventHandler.mock.calls[0][0])).toEqual([
      'type',
      'payload',
    ])
    expect(eventHandler.mock.calls[0][0]).toEqual(event)

    removeEventHandler(eventHandler)

    emitEvent(event)
    state = runOneFrame({ state })

    expect(eventHandler).toHaveBeenCalledTimes(1)
  })

  it('should handle internal events emmited from external functions', () => {
    let state = getInitialStateWithSystems()

    const event: WindowResizeEvent = {
      type: CanvasEngineEvent.windowResize,
      payload: null,
    }
    const eventHandler = vi.fn(({ state }) => state)
    const internalEventHandler = vi.fn(({ state }) => state)

    addEventHandler(event.type, eventHandler)
    addEventHandler(event.type, internalEventHandler)
    expect(eventHandler).not.toHaveBeenCalled()

    emitEvent(event)

    expect(internalEventHandler).not.toHaveBeenCalled()

    state = runOneFrame({ state })

    expect(internalEventHandler).toHaveBeenCalled()
    expect(Object.keys(internalEventHandler.mock.calls[0][0])).toEqual([
      'type',
      'payload',
    ])
    expect(internalEventHandler.mock.calls[0][0]).toEqual(event)
  })

  it('should handle deeply nested events', () => {
    type Test = { count: number }
    const name = 'test'
    const event: WindowResizeEvent = {
      type: CanvasEngineEvent.windowResize,
      payload: null,
    }
    const entity = generateEntity()

    let state = createEntity(getInitialStateWithSystems(), entity)

    state = createComponent<Test, InitialState>(state, name, entity, {
      count: 0,
    })

    let count = 0

    const eventHandler = vi.fn(() => {
      emitEvent(event)
      count++
    })

    addEventHandler(CanvasEngineEvent.windowResize, eventHandler)

    expect(eventHandler).not.toHaveBeenCalled()

    emitEvent(event)

    Array.from({ length: 6 }).forEach((_, i) => {
      state = runOneFrame({ state })
      expect(count).toEqual(i + 1)
    })
  })
})
