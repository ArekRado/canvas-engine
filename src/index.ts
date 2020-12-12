export * from './type'
export { runOneFrame } from './util/runOneFrame'
export * as bezierFunction from './util/bezierFunction'
export { initialState, setScene } from './util/state'
export { initializeEngine } from './util/initializeEngine'
export { jsonToState, stateToJson } from './util/jsonState'
export { createSystem, createGlobalSystem } from './system/createSystem'
export {
  setComponent,
  removeComponent,
  getComponent,
  componentName,
} from './component'

import {
  defaultAnimation,
  defaultBlueprint,
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
  blueprint: defaultBlueprint,
}

// @todo
// https://github.com/formium/tsdx/pull/535
// https://github.com/formium/tsdx/issues/276
// https://github.com/formium/tsdx/pull/367
// https://github.com/formium/tsdx/issues/276
