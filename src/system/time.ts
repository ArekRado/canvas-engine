import { createSystem } from '..'
import {
  componentName,
  createGetSetForUniqComponent,
  setComponent,
} from '../component'
import { systemPriority } from '../system/createSystem'
import { InternalInitialState, Time } from '../type'

const timeEntity = 'timeEntity'

const timeGetSet = createGetSetForUniqComponent<Time, InternalInitialState>({
  entity: timeEntity,
  name: componentName.time,
})

export const getTime = timeGetSet.getComponent
export const setTime = timeGetSet.setComponent

export const timeSystem = (state: InternalInitialState) => {
  state = setComponent<Time, InternalInitialState>({
    state,
    data: {
      entity: timeEntity,
      name: componentName.time,
      delta: 0,
      timeNow: performance.now(),
      previousTimeNow: performance.now(),
      dataOverwrite: undefined,
    },
  })

  return createSystem<Time, InternalInitialState>({
    name: componentName.time,
    priority: systemPriority.time,
    state,
    tick: ({ state, component }) => {
      const timeNow = component.dataOverwrite?.timeNow ?? performance.now()
      const previousTimeNow =
        component.dataOverwrite?.previousTimeNow ?? component.timeNow
      const delta = component.dataOverwrite?.delta ?? timeNow - previousTimeNow
      state = setTime({
        state,
        data: {
          entity: component.entity,
          name: component.name,
          delta,
          timeNow,
          previousTimeNow,
        },
      })

      return state
    },
  })
}
