export * from './type'
export * from './main'
export * from './util/runOneFrame'
export * as bezierFunction from './util/bezierFunction'
export * from './util/asset'
export * as entity from './util/entity'

import { transform } from './component/transform'
import { sprite } from './component/sprite'
import { collideCircle } from './component/collideCircle'
import { collideBox } from './component/collideBox'
import { animation } from './component/animation'

export const component = {
  transform,
  sprite,
  collideCircle,
  collideBox,
  animation,
}

// @todo
// https://github.com/formium/tsdx/pull/535
// https://github.com/formium/tsdx/issues/276
// https://github.com/formium/tsdx/pull/367
// https://github.com/formium/tsdx/issues/276
