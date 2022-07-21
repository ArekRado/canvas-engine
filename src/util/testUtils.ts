import { timeEntity } from '../system/time/time'
import { updateTime } from '../system/time/timeCrud'
import { InternalInitialState } from '../type'
import { runOneFrame, _resetModuloTimeBuffer } from './runOneFrame'

export const tick = (timeNow: number, state: InternalInitialState) => {
  // if (timeNow === 0) {
  //   _resetModuloTimeBuffer()
  // }

  state = updateTime({
    state,
    entity: timeEntity,
    update: () => ({
      dataOverwrite: {
        previousTimeNow: timeNow === 0 ? 0 : undefined,
        // delta: 0,
        timeNow,
      },
    }),
  }) as InternalInitialState

  return runOneFrame({ state })
}
