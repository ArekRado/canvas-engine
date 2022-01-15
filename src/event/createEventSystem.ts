import { InternalInitialState } from '..'
import { createGlobalSystem } from '../system/createSystem'
import { AnyState } from '../type'
import { internalEventHandler } from './internalEventHandler'

export type ECSEvent<Type, Payload> = {
  type: Type
  payload: Payload
}

type AcitveBuffer = 'first' | 'second'

export type EventHandler<AllEvents, State extends AnyState = AnyState> = ({
  state,
  event,
}: {
  state: State
  event: AllEvents
}) => State
export const createEventSystem = <
  AllEvents,
  State extends AnyState = AnyState,
>({
  eventHandler,
  _internalEventHandler = internalEventHandler as any,
}: {
  eventHandler: EventHandler<AllEvents, State>
  _internalEventHandler?: (params: {
    state: InternalInitialState
    event: AllEvents
  }) => InternalInitialState
}) => {
  let activeBuffer: AcitveBuffer = 'first'

  let eventBuffer: AllEvents[] = []
  /**
   * events emited inside events are located in secondEventBuffer
   */
  let secondEventBuffer: AllEvents[] = []

  const emitEvent = <Event extends AllEvents>(event: Event) => {
    if (activeBuffer === 'first') {
      eventBuffer.push(event)
    } else {
      secondEventBuffer.push(event)
    }
  }

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

  return {
    emitEvent,
    eventSystem: (state: State) =>
      createGlobalSystem({
        state,
        name: 'event',
        tick: ({ state }) => {
          lockFirstBuffer()

          state = eventBuffer.reduce(
            (acc, event) => {
              acc = _internalEventHandler({
                state: acc as unknown as InternalInitialState,
                event,
              }) as unknown as State
              return eventHandler({ state: acc, event })
            },

            state,
          )

          resetEventBuffer()
          unlockFirstBuffer()

          return state
        },
      }),
  }
}
