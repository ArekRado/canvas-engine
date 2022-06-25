import { componentName } from '../../component/componentName'
import { createSystem, systemPriority } from '../createSystem'
import { InternalInitialState, Time } from '../../type'
import { updateComponent } from '../../component/updateComponent'
import { createComponent } from '../../component/createComponent'

export const timeEntity = 'timeEntity'

export const timeSystem = (state: InternalInitialState) => {
  state = createComponent<Time, InternalInitialState>({
    state,
    entity: timeEntity,
    name: componentName.time,
    data: {
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
    tick: ({ state, component, name, entity }) => {
      const timeNow = component.dataOverwrite?.timeNow ?? performance.now()
      const previousTimeNow =
        component.dataOverwrite?.previousTimeNow ?? component.timeNow
      const delta = timeNow - previousTimeNow

      state = updateComponent<Time, InternalInitialState>({
        state,
        name,
        entity,
        update: () => ({
          delta,
          timeNow,
          previousTimeNow,
        }),
      })

      return state
    },
  })
}
