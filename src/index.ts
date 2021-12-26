export * from './type'
export { runOneFrame } from './util/runOneFrame'
export { jsonToState, stateToJson } from './util/jsonState'
export {
  TimingFunction,
  CommonBezierFunction,
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
  getValue,
} from './util/bezierFunction'
export {
  createSystem,
  createGlobalSystem,
  systemPriority,
} from './system/createSystem'
export {
  setComponent,
  removeComponent,
  getComponent,
  componentName,
} from './component'

export * as defaultData from './util/defaultComponents'

import {
  addSprite,
  removeSprite,
  addBlueprint,
  removeBlueprint,
} from './util/asset'

export {
  getEntity,
  createEntity as generateEntity,
  setEntity,
  removeEntity,
} from './entity'

export const asset = {
  addSprite,
  removeSprite,
  addBlueprint,
  removeBlueprint,
}

// @todo
// https://github.com/formium/tsdx/pull/535
// https://github.com/formium/tsdx/issues/276
// https://github.com/formium/tsdx/pull/367
// https://github.com/formium/tsdx/issues/276
