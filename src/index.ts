export * from './type'
export { runOneFrame } from './util/runOneFrame'
export * as bezierFunction from './util/bezierFunction'
export { initialState, setScene } from './util/state'
export { initializeEngine } from './util/initializeEngine'
export { jsonToState, stateToJson } from './util/jsonState'
export { createSystem } from './system/createSystem'

import {
  defaultAnimation,
  defaultCollideBox,
  defaultCollideCircle,
  defaultSprite,
  defaultTransform,
} from './util/defaultComponents'
import {
  addSprite,
  removeSprite,
  addBlueprint,
  removeBlueprint,
} from './util/asset'
import { generate, set, remove } from './util/entity'
import {
  setComponent,
  removeComponent,
  getComponent
} from './component'

export const asset = {
  addSprite,
  removeSprite,
  addBlueprint,
  removeBlueprint,
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

export {
  setComponent,
  removeComponent,
  getComponent
}

// @todo
// https://github.com/formium/tsdx/pull/535
// https://github.com/formium/tsdx/issues/276
// https://github.com/formium/tsdx/pull/367
// https://github.com/formium/tsdx/issues/276
