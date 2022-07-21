import { getState } from '../../util/state'
import { runOneFrame } from '../../util/runOneFrame'
import { AnyState, Time } from '../../type'
import { MAX_ALLOWED_DELTA, mutateMaxAllowedDelta, timeEntity } from './time'
import { componentName } from '../../component/componentName'
import { getComponent } from '../../component/getComponent'
import { updateTime } from './timeCrud'

const setTime = ({ state, data }: { state: AnyState; data: Partial<Time> }) =>
  updateTime({
    state,
    entity: timeEntity,
    update: () => data,
  })

const getTime = ({ state }: { state: AnyState }) =>
  getComponent<Time>({
    state,
    entity: timeEntity,
    name: componentName.time,
  })

describe('time', () => {
  it('should change time - start from 0 case', () => {
    let state = setTime({
      state: getState({}),
      data: {
        dataOverwrite: {
          delta: 0,
          timeNow: 0,
          previousTimeNow: 0,
        },
      },
    })
    state = runOneFrame({ state })

    expect(getTime({ state })?.timeNow).toBe(0)
    expect(getTime({ state })?.delta).toBe(0)

    state = setTime({
      state,
      data: { dataOverwrite: { timeNow: 10, previousTimeNow: 0 } },
    })
    state = runOneFrame({ state })

    expect(getTime({ state })?.timeNow).toBe(10)
    expect(getTime({ state })?.delta).toBe(10)

    state = setTime({
      state,
      data: { dataOverwrite: { timeNow: 12, previousTimeNow: 10 } },
    })

    state = runOneFrame({ state })

    expect(getTime({ state })?.timeNow).toBe(12)
    expect(getTime({ state })?.delta).toBe(2)
  })

  it('should change time - start from non 0 case', () => {
    let state = setTime({
      state: getState({}),
      data: {
        dataOverwrite: {
          timeNow: 10,
          previousTimeNow: 0,
        },
      },
    })
    state = runOneFrame({ state })

    expect(getTime({ state })?.timeNow).toBe(10)
    expect(getTime({ state })?.delta).toBe(10)

    state = setTime({
      state,
      data: {
        dataOverwrite: {
          timeNow: 20,
          previousTimeNow: 10,
        },
      },
    })
    state = runOneFrame({ state })

    expect(getTime({ state })?.timeNow).toBe(20)
    expect(getTime({ state })?.delta).toBe(10)

    state = setTime({
      state,
      data: {
        dataOverwrite: {
          timeNow: 22,
          previousTimeNow: 20,
        },
      },
    })
    state = runOneFrame({ state })

    expect(getTime({ state })?.timeNow).toBe(22)
    expect(getTime({ state })?.delta).toBe(2)
  })

  it('should clamp delta when is bigger than MAX_ALLOWED_DELTA', () => {
    mutateMaxAllowedDelta(34)

    let state = setTime({
      state: getState({}),
      data: {
        dataOverwrite: {
          delta: 0,
          timeNow: 0,
          previousTimeNow: 0,
        },
      },
    })
    state = runOneFrame({ state })

    expect(getTime({ state })?.timeNow).toBe(0)
    expect(getTime({ state })?.delta).toBe(0)

    state = setTime({
      state,
      data: { dataOverwrite: { timeNow: 1000, previousTimeNow: 0 } },
    })
    state = runOneFrame({ state })

    expect(getTime({ state })?.timeNow).toBe(1000)
    expect(getTime({ state })?.delta).toBe(MAX_ALLOWED_DELTA)

    state = setTime({
      state,
      data: { dataOverwrite: { timeNow: 1002, previousTimeNow: 1000 } },
    })

    state = runOneFrame({ state })

    expect(getTime({ state })?.timeNow).toBe(1002)
    expect(getTime({ state })?.delta).toBe(2)
  })
})