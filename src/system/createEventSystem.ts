import { componentName } from '../component'
import { createGlobalSystem } from './createSystem'
import { State } from '../type'

export type ECSEvent<Type, Payload> = {
  type: Type
  payload: Payload
}

type AcitveBuffer = 'first' | 'second'

export type EventHandler<AllEvents> = ({
  state,
  event,
}: {
  state: State
  event: AllEvents
}) => State
// TODO add internal eventSystemHandler
export const createEventSystem = <AllEvents>(
  eventHandler: EventHandler<AllEvents>,
) => {
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
        name: componentName.event,
        tick: ({ state }) => {
          lockFirstBuffer()

          state = eventBuffer.reduce(
            (acc, event) => eventHandler({ state: acc, event }),
            state,
          )

          resetEventBuffer()
          unlockFirstBuffer()

          return state
        },
      }),
  }
}
