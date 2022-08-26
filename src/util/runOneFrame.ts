import { timeEntity } from '../system/time/time'
import { getTime, updateTime } from '../system/time/timeCrud'
import { AnyState } from '../type'

export const FIXED_TICK_TIME = 1 // 1ms

let _moduloTimeBuffer = 0 // in situation when delta is 15.65 fixedTick will be triggered 15 times, next frame will use this value to increase amount of calls

export const _resetModuloTimeBuffer = () => (_moduloTimeBuffer = 0)

const getFixedTickAmount = (state: AnyState): number => {
  const delta =
    getTime({
      entity: timeEntity,
      state,
    })?.delta ?? 0

  let fixedTickLoops = Math.floor(delta / FIXED_TICK_TIME)
  const modulo = delta % FIXED_TICK_TIME

  if (modulo + _moduloTimeBuffer >= FIXED_TICK_TIME) {
    fixedTickLoops += 1
    _moduloTimeBuffer -= FIXED_TICK_TIME
  } else {
    _moduloTimeBuffer += modulo
  }

  return fixedTickLoops
}

export const runOneFrame = <State extends AnyState = AnyState>({
  state,
}: {
  state: State
}): State => {
  const fixedTickLoops = getFixedTickAmount(state)

  const allSystems = [...state.system, ...state.globalSystem]
    .concat()
    .sort((a, b) => (a.priority > b.priority ? 1 : -1))

  const timeBeforeFixedTicks = getTime({
    entity: timeEntity,
    state,
  })

  // Loop for fixedTicks
  Array.from({ length: fixedTickLoops }).forEach(() => {
    // Fixed tick has to have delta equal to FIXED_TICK_TIME
    state = updateTime({
      state,
      entity: timeEntity,
      update: (time) => ({
        delta: FIXED_TICK_TIME,
        timeNow: time.timeNow + FIXED_TICK_TIME,
        dataOverwrite: {
          ...time.dataOverwrite,
          delta: FIXED_TICK_TIME,
          timeNow: time.timeNow + FIXED_TICK_TIME,
        },
      }),
    }) as State

    for (let i = 0; i < allSystems.length; i++) {
      const system = allSystems[i]
      if (system.fixedTick) {
        state = system.fixedTick({ state }) as State
      }
    }
  })

  // reset time after fixed updates. It's the easiest way to return to previous time values without worrying about modulo
  state = updateTime({
    state,
    entity: timeEntity,
    update: () => ({
      ...timeBeforeFixedTicks,
    }),
  }) as State

  // Loop for normal ticks
  for (let i = 0; i < allSystems.length; i++) {
    const system = allSystems[i]
    if (system.tick) {
      state = system.tick({ state }) as State
    }
  }

  return state
}
