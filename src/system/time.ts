import {
  componentName,
  createGetSetForUniqComponent,
  setComponent,
} from '../component'
import { createGlobalSystem, systemPriority } from '../system/createSystem'
import { State, Time } from '../type'

const timeEntity = 'timeEntity'

const timeGetSet = createGetSetForUniqComponent<Time>({
  entity: timeEntity,
  name: componentName.time,
})

export const getTime = timeGetSet.getComponent
export const setTime = timeGetSet.setComponent

export const timeSystem = (state: State) => {
  state = setComponent<Time>({
    state,
    data: {
      entity: timeEntity,
      name: componentName.time,
      delta: 0,
      timeNow: performance.now(),
      previousTimeNow: performance.now(),
    },
  })

  return createGlobalSystem<Time>({
    name: componentName.time,
    priority: systemPriority.time,
    state,
    tick: ({ state }) => {
      const time = getTime({ state })

      if (time) {
        state = setTime({
          state,
          data: {
            ...time,
            delta: time.timeNow - time.previousTimeNow,
            timeNow: performance.now(),
            previousTimeNow: time.timeNow,
          },
        })
      }

      return state
    },
  })
}
