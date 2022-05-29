import { componentName } from "../component/componentName"
import { updateComponent } from "../component/updateComponent"
import { timeEntity } from "../system/time/time"
import { InternalInitialState } from "../type"
import { runOneFrame } from "../util/runOneFrame"

export const tick = (timeNow: number, state: InternalInitialState) => {
  state = updateComponent({
    state,
    entity: timeEntity,
    name: componentName.time,
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