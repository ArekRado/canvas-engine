import { timeEntity } from "../system/time/time"
import { updateTime } from "../system/time/timeCrud"
import { InternalInitialState } from "../type"
import { runOneFrame } from "./runOneFrame"

export const tick = (timeNow: number, state: InternalInitialState) => {
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
  })

  return runOneFrame({ state })
}