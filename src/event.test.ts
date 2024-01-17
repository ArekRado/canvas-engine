import { createEntity } from './entity/createEntity'
import { createComponent } from './component/createComponent'
import { generateEntity } from './entity/generateEntity'
import { ECSEvent, EmptyState } from './type'
import { runOneFrame } from './util/runOneFrame'
import { getEmptyState } from './util/state'
import { vi, describe, it, expect } from 'vitest'
import { createStore } from './store'

export enum CanvasEngineEvent {
  windowResize = 'CanvasEngineEvent-windowResize',
  colliderCollision = 'CanvasEngineEvent-colliderCollision',

  renderLoopStart = 'CanvasEngineEvent-renderLoopStart',
  mouseActionEvent = 'CanvasEngineEvent-mouseActionEvent',
  keyboardActionEvent = 'CanvasEngineEvent-keyboardActionEvent',
}

export type WindowResizeEvent = ECSEvent<CanvasEngineEvent.windowResize, null>
export type RenderLoopStartEvent = ECSEvent<
  CanvasEngineEvent.renderLoopStart,
  {
    animationFrame: number
  }
>

describe('event', () => {
  it('should emit, receive events and add, remove event handlers', () => {
    const store = createStore()
    const event: ECSEvent<string, string> = {
      type: 'example',
      payload: 'payload',
    }
    const eventHandler = vi.fn(({ state }) => state)
    store.addEventHandler<typeof event>(event.type, eventHandler)

    expect(eventHandler).not.toHaveBeenCalled()

    store.emitEvent(event)

    expect(eventHandler).not.toHaveBeenCalled()

    runOneFrame(store.getState())

    expect(eventHandler).toHaveBeenCalledTimes(1)
    expect(Object.keys(eventHandler.mock.calls[0][0])).toEqual([
      'type',
      'payload',
    ])
    expect(eventHandler.mock.calls[0][0]).toEqual(event)

    store.removeEventHandler(eventHandler)

    store.emitEvent(event)
    runOneFrame(store.getState())

    expect(eventHandler).toHaveBeenCalledTimes(1)
  })

  it('should handle internal events emmited from external functions', () => {
    const store = createStore()

    const event: WindowResizeEvent = {
      type: CanvasEngineEvent.windowResize,
      payload: null,
    }
    const eventHandler = vi.fn(({ state }) => state)
    const internalEventHandler = vi.fn(({ state }) => state)

    store.addEventHandler(event.type, eventHandler)
    store.addEventHandler(event.type, internalEventHandler)
    expect(eventHandler).not.toHaveBeenCalled()

    store.emitEvent(event)

    expect(internalEventHandler).not.toHaveBeenCalled()

    runOneFrame(store.getState())

    expect(internalEventHandler).toHaveBeenCalled()
    expect(Object.keys(internalEventHandler.mock.calls[0][0])).toEqual([
      'type',
      'payload',
    ])
    expect(internalEventHandler.mock.calls[0][0]).toEqual(event)
  })

  it('should handle deeply nested events', () => {
    const store = createStore()

    type Test = { count: number }
    const name = 'test'
    const event: WindowResizeEvent = {
      type: CanvasEngineEvent.windowResize,
      payload: null,
    }
    const entity = generateEntity()
    const state = store.getState()

    createEntity(state, entity)
    createComponent<Test, EmptyState>(state, name, entity, {
      count: 0,
    })

    let count = 0

    const eventHandler = vi.fn(() => {
      store.emitEvent(event)
      count++
    })

    store.addEventHandler(CanvasEngineEvent.windowResize, eventHandler)

    expect(eventHandler).not.toHaveBeenCalled()

    store.emitEvent(event)

    Array.from({ length: 6 }).forEach((_, i) => {
      runOneFrame(store.getState())

      expect(count).toEqual(i + 1)
    })
  })
})
