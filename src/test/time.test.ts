import { getState } from '../util/state'
import { runOneFrame } from '../util/runOneFrame'
import { getTime, setTime } from '../system/time/time'

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
      data: { dataOverwrite: { timeNow: 1000, previousTimeNow: 0 } },
    })
    state = runOneFrame({ state })

    expect(getTime({ state })?.timeNow).toBe(1000)
    expect(getTime({ state })?.delta).toBe(1000)

    state = setTime({
      state,
      data: { dataOverwrite: { timeNow: 1002, previousTimeNow: 1000 } },
    })

    state = runOneFrame({ state })

    expect(getTime({ state })?.timeNow).toBe(1002)
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
          timeNow: 1000,
          previousTimeNow: 10,
        },
      },
    })
    state = runOneFrame({ state })

    expect(getTime({ state })?.timeNow).toBe(1000)
    expect(getTime({ state })?.delta).toBe(990)

    state = setTime({
      state,
      data: {
        dataOverwrite: {
          timeNow: 1002,
          previousTimeNow: 1000,
        },
      },
    })
    state = runOneFrame({ state })

    expect(getTime({ state })?.timeNow).toBe(1002)
    expect(getTime({ state })?.delta).toBe(2)
  })
})
