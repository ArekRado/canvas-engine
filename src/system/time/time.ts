import { setComponent } from '../../component/setComponent'
import { componentName } from '../../component/componentName'
import { createSystem, systemPriority } from '../createSystem'
import { InternalInitialState, Time } from '../../type'
import { createGetSetForUniqComponent } from '../../util/createGetSetForUniqComponent'

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
    componentName: componentName.time,
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
