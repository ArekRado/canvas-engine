export * from './type'

export { generateEntity } from './entity/generateEntity'
export { getEntity } from './entity/getEntity'
export { removeEntity } from './entity/removeEntity'
export { createEntity } from './entity/createEntity'

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
} from './event'

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

// TODO
// - create and update entity, remove setEntity
// - remove name and enitty from component - path already contains that information.
// - add debug name to entity
// - flag "autoRemoveAtTheEnd" - removes finished animation
// - getComponentsByName - delete this, it removes single components so it can keep entity without components which is bad idea. Users may think about it as a removeEntitiesByComponentName which is not true
// - do not use v4 to generate entity