import { componentName } from '../../component/componentName'
import { createSystem, systemPriority } from '../createSystem'
import { AnyState, Time } from '../../type'
import { createTime, updateTime } from './timeCrud'
import { createEntity } from '../../entity/createEntity'

export const timeEntity = 'time'

export const timeSystem = (state: AnyState) => {
  state = createEntity({
    entity: timeEntity,
    state,
  })

  state = createTime({
    state,
    entity: timeEntity,
    data: {
      delta: 0,
      timeNow: performance.now(),
      previousTimeNow: performance.now(),
      dataOverwrite: undefined,
    },
  })

  return createSystem<Time, AnyState>({
    name: componentName.time,
    componentName: componentName.time,
    priority: systemPriority.time,
    state,
    tick: ({ state, component, entity }) => {
      const timeNow = component.dataOverwrite?.timeNow ?? performance.now()
      const previousTimeNow =
        component.dataOverwrite?.previousTimeNow ?? component.timeNow
      const delta = timeNow - previousTimeNow

      state = updateTime({
        state,
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
