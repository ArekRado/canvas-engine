// Types
export * from './type'

// Entity
export { generateEntity } from './entity/generateEntity'
export { getEntity } from './entity/getEntity'
export { removeEntity } from './entity/removeEntity'
export { createEntity } from './entity/createEntity'

export { timeEntity } from './system/time/time'
export { cameraEntity } from './system/camera/camera'
export { mouseEntity } from './system/mouse/mouse'
export { keyboardEntity } from './system/keyboard/keyboard'

// Component
export { componentName } from './component/componentName'
export { createComponent } from './component/createComponent'
export { getComponent } from './component/getComponent'
export { getComponentsByName } from './component/getComponentsByName'
export { recreateAllComponents } from './component/recreateAllComponents'
export { removeComponent } from './component/removeComponent'
export { updateComponent } from './component/updateComponent'


// Utils
export { getThreeMesh } from './system/mesh/mesh'
export { getThreeMaterial } from './system/material/material'

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
export { runRenderLoop } from './util/runRenderLoop'

export {
  defaultAnimation,
  defaultCollider,
  defaultRigidBody,
  defaultMouseInteraction,
  defaultCamera,
  defaultTransform,
  defaultMouse,
  defaultKeyboard,
  defaultMaterial,
} from './util/defaultComponents'
export { getState } from './util/state'

// CRUD
export * from './system/animation/animationCrud'
export * from './system/camera/cameraCrud'
export * from './system/collider/colliderCrud'
export * from './system/keyboard/keyboardCrud'
export * from './system/material/materialCrud'
export * from './system/mesh/meshCrud'
export * from './system/mouse/mouseCrud'
export * from './system/mouseInteraction/mouseInteractionCrud'
export * from './system/rigidBody/rigidBodyCrud'
export * from './system/time/timeCrud'
export * from './system/transform/transformCrud'

export { createComponentCrud } from './util/createComponentCrud'



// TODO
// enabled flag in collider box
// eventHandler shuld be triggered only for observed event