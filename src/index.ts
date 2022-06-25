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
export {
  defaultAnimation,
  defaultCollider,
  defaultRigidBody,
  defaultMouseInteraction,
  defaultCamera,
  defaultTransform,
  defaultMouse,
  defaultKeyboard,
} from './util/defaultComponents'
export { getState } from './util/state'
