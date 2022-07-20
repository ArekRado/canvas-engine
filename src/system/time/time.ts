import { componentName } from '../../component/componentName'
import { createSystem, systemPriority } from '../createSystem'
import { AnyState, Time } from '../../type'
import { createTime, updateTime } from './timeCrud'
import { createEntity } from '../../entity/createEntity'

export const timeEntity = 'time'

export let MAX_ALLOWED_DELTA = process.env.NODE_ENV === 'test' ? 10000 : 34

export const mutateMaxAllowedDelta = (newMaxAllowedDelta: number) => {
  MAX_ALLOWED_DELTA = newMaxAllowedDelta
}

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
          delta: Math.min(MAX_ALLOWED_DELTA, delta),
          timeNow,
          previousTimeNow,
        }),
      })

      return state
    },
  })
}
