import { createGlobalSystem } from './createSystem'
import { AnyState, InternalInitialState } from '../type'
import { internalEventHandler } from '../util/internalEventHandler'

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

export const addEventHandler = (eventHandler: EventHandler<any, any>): void => {
  eventHandlers.push(eventHandler)
}

export const removeEventHandler = (eventHandler: EventHandler<any, any>) => {
  eventHandlers = eventHandlers.filter((e) => e !== eventHandler)
}

let activeBuffer: AcitveBuffer = 'first'

let eventBuffer: any[] = []
/**
 * events emited inside events are located in secondEventBuffer
 */
let secondEventBuffer: any[] = []

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
        (acc, event) =>
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
