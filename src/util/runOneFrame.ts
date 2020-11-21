import { State } from '../main'
import { update as timeSystemUpdate } from '../system/time'
import { drawSystem } from '../system/draw'
import { transformSystem } from '../system/transform'
import { collideBoxSystem } from '../system/collideBox'
import { update as IOSystemUpdate } from '../system/io'
import { animationSystem } from '../system/animation'

type RunOneFrame = (params: { state: State; timeNow?: number }) => State

export const runOneFrame: RunOneFrame = ({ state, timeNow }) => {
  const v1 = timeSystemUpdate({ state, timeNow })
  const v2 = IOSystemUpdate({ state: v1 })

  const v3 = transformSystem.tick({ state: v2 })
  const v5 = collideBoxSystem.tick({ state: v3 })
  // const v5 = collideCircleSystem.tick({ state: v4 })
  const v6 = animationSystem.tick({ state: v5 })

  // const newState = v2.entity.reduce((acc, entity) => {

  //   return v6
  // }, v2)

  const v7 = drawSystem.tick({ state: v6 })

  return v7
}
