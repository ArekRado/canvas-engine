/* eslint-disable @typescript-eslint/no-explicit-any */
import { createGlobalSystem } from './system/createSystem'
import { AllEvents, AnyState, InternalInitialState } from './type'
import { internalEventHandler } from './util/internalEventHandler'

type AcitveBuffer = 'first' | 'second'

export const internalEventNamePrefix = '@canvas-engine'

export type EventHandler<AllEvents, State extends AnyState = AnyState> = ({
  state,
  event,
}: {
  state: State
  event: AllEvents
}) => State

let eventHandlers: EventHandler<any, any>[] = [internalEventHandler]

export const addEventHandler = <
  Events = AllEvents,
  State extends AnyState = AnyState,
>(
  eventHandler: EventHandler<Events, State>,
): void => {
  if (process.env.NODE_ENV === 'test') {
    if (eventHandlers.find((handler) => handler === eventHandler)) {
      console.warn('This event handler has been already added', eventHandler)
    }
  }

  eventHandlers.push(eventHandler)
}

export const removeEventHandler = (
  eventHandler: EventHandler<unknown, any>,
) => {
  eventHandlers = eventHandlers.filter((e) => e !== eventHandler)
}

let activeBuffer: AcitveBuffer = 'first'

let eventBuffer: unknown[] = []
/**
 * events emited inside event handlers are moved to secondEventBuffer
 */
let secondEventBuffer: unknown[] = []

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

export const emitEvent = <Event>(event: Event) => {
  if (activeBuffer === 'first') {
    eventBuffer.push(event)
  } else {
    secondEventBuffer.push(event)
  }
}

export const eventSystem = (state: InternalInitialState) =>
  createGlobalSystem({
    state,
    name: 'event',
    tick: ({ state }) => {
      lockFirstBuffer()

      state = eventBuffer.reduce(
        (acc: InternalInitialState, event) =>
          eventHandlers.reduce(
            (acc2, eventHandler) =>
              eventHandler({
                state: acc2,
                event,
              }),
            acc,
          ),

        state,
      )

      resetEventBuffer()
      unlockFirstBuffer()

      return state
    },
  })
