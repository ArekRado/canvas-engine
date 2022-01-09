export * from './type'
export { runOneFrame } from './util/runOneFrame'
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
  removeComponentsByName,
  recreateAllComponents,
  createGetSetForUniqComponent,
} from './component'

export * as defaultData from './util/defaultComponents'

export {
  getEntity,
  createEntity as generateEntity,
  setEntity,
  removeEntity,
} from './entity'
