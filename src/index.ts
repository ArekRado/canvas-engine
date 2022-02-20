export * from './type'

export { generateEntity } from './entity/generateEntity'
export { getEntity } from './entity/getEntity'
export { removeEntity } from './entity/removeEntity'
export { setEntity } from './entity/setEntity'

export { componentName } from './component/componentName'
export { createComponent } from './component/createComponent'
export { getComponent } from './component/getComponent'
export { getComponentsByName } from './component/getComponentsByName'
export { recreateAllComponents } from './component/recreateAllComponents'
export { removeComponent } from './component/removeComponent'
export { removeComponentsByName } from './component/removeComponentsByName'
export { setComponent } from './component/setComponent'
export { updateComponent } from './component/updateComponent'

export {
  createSystem,
  createGlobalSystem,
  systemPriority,
} from './system/createSystem'
export {
  emitEvent,
  addEventHandler,
  removeEventHandler,
  EventHandler,
} from './system/event'

export { runOneFrame } from './util/runOneFrame'
export { createGetSetForUniqComponent } from './util/createGetSetForUniqComponent'
export {
  defaultAnimation,
  defaultCollideBox,
  defaultCollideCircle,
  defaultMouseInteraction,
  defaultCamera,
  defaultTransform,
  defaultMouse,
  defaultKeyboard,
} from './util/defaultComponents'
export { getState } from './util/state'
