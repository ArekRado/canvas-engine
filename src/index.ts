export * from './type'
export { runOneFrame } from './util/runOneFrame'
export * as bezierFunction from './util/bezierFunction'
export { initialState } from './util/initialState'
export { initialize } from './util/initialize'
export { jsonToState, stateToJson } from './util/jsonState'
export { createSystem } from './system/createSystem'
export * from './component'

import {
  defaultAnimation,
  defaultCollideBox,
  defaultCollideCircle,
  defaultSprite,
  defaultTransform,
} from './util/defaultComponents'
import { addSprite, removeSprite } from './util/asset'
import { generate, set, remove } from './util/entity'

export const asset = {
  addSprite,
  removeSprite,
}

export const entity = {
  generate,
  set,
  remove,
}

export const defaultData = {
  animation: defaultAnimation,
  collideBox: defaultCollideBox,
  collideCircle: defaultCollideCircle,
  sprite: defaultSprite,
  transform: defaultTransform,
}

// @todo
// https://github.com/formium/tsdx/pull/535
// https://github.com/formium/tsdx/issues/276
// https://github.com/formium/tsdx/pull/367
// https://github.com/formium/tsdx/issues/276
