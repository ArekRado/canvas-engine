/* eslint-disable @typescript-eslint/no-explicit-any */
import { createGlobalSystem } from './system/createSystem'
import { InitialState, ECSEvent } from './type'

type AcitveBuffer = 'first' | 'second'

export const internalEventNamePrefix = '@canvas-engine'

export type EventHandler<AllEvents> = (event: AllEvents) => void

let eventHandlers: [string, EventHandler<any>][] = []

export const addEventHandler = <Event extends ECSEvent<string, unknown>>(
  type: Event['type'],
  eventHandler: EventHandler<Event>,
): void => {
  eventHandlers.push([type, eventHandler])
}

export const removeEventHandler = (eventHandler: EventHandler<any>) => {
  eventHandlers = eventHandlers.filter(
    ([_, handler]) => handler !== eventHandler,
  )
}

let activeBuffer: AcitveBuffer = 'first'

let eventBuffer: ECSEvent<string, unknown>[] = []
/**
 * events emited inside event handlers are moved to secondEventBuffer
 */
let secondEventBuffer: ECSEvent<string, unknown>[] = []

const resetEventBuffer = () => {
  eventBuffer = []
}

const lockFirstBuffer = () => {
  activeBuffer = 'second'
  secondEventBuffer = []
}

const unlockFirstBuffer = () => {
  activeBuffer = 'first'
  eventBuffer = [...secondEventBuffer]
}

export const emitEvent = <Event extends ECSEvent<string, unknown>>(
  event: Event,
) => {
  if (activeBuffer === 'first') {
    eventBuffer.push(event)
  } else {
    secondEventBuffer.push(event)
  }
}

export const resetEventState = () => {
  activeBuffer = 'first'
  resetEventBuffer()
  secondEventBuffer = []
  eventHandlers = []
}

export const eventSystem = (state: InitialState): InitialState => {
  resetEventState()

  return createGlobalSystem({
    state,
    name: 'event',
    tick: ({ state }) => {
      lockFirstBuffer()

      for (let i = 0; i < eventBuffer.length; i++) {
        const event = eventBuffer[i]
        for (let j = 0; j < eventHandlers.length; j++) {
          const type = eventHandlers[j][0]

          if (type === event.type) {
            const eventHandler = eventHandlers[j][1]

            eventHandler(event)
          }
        }
      }

      resetEventBuffer()
      unlockFirstBuffer()

      return state
    },
  })
}
