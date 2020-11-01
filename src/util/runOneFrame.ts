import { State } from '../main'
import { update as timeSystemUpdate } from '../system/time'
import { update as drawSystemUpdate } from '../system/draw'
import { update as transformSystemUpdate } from '../system/transform'
import { update as collideSystemUpdate } from '../system/collide'
import { update as transformSystemIO } from '../system/io'

type RunOneFrame = (params: {
  state: State
  enableDraw: boolean
  timeNow?: number
}) => State

export const runOneFrame: RunOneFrame = ({ state, enableDraw, timeNow }) => {
  // const newState =
  //   state
  //   ->Time_System.update(~timeNowOverride=?timeNow, ~state=_, ())
  //   ->IO_System.update(~state=_)
  //   ->Transform_System.update(~state=_)
  //   ->Collide_System.update(~state=_)
  //   ->Animation_System.update(~state=_)
  //   ->Draw_System.update(~enableDraw, ~state=_);

  const v1 = timeSystemUpdate({ state, timeNow })
  const v2 = transformSystemIO({ state: v1 })
  const v3 = transformSystemUpdate({ state: v2 })
  const v4 = collideSystemUpdate({ state: v3 })

  const v5 = drawSystemUpdate({ state: v4, enableDraw })

  return v5
}
