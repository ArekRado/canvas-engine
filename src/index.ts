export * from './type'
export { runOneFrame } from './util/runOneFrame'
export * as bezierFunction from './util/bezierFunction'
export { initialState } from './util/initialState'
export { initialize } from './util/initialize'
export { jsonToState, stateToJson } from './util/jsonState'
export * from './component'

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

// @todo
// https://github.com/formium/tsdx/pull/535
// https://github.com/formium/tsdx/issues/276
// https://github.com/formium/tsdx/pull/367
// https://github.com/formium/tsdx/issues/276
