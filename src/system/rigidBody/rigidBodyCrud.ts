import { componentName } from '../../component/componentName'
import { RigidBody } from '../../type'
import { createComponentCrud } from '../../util/createComponentCrud'

const crud = createComponentCrud<RigidBody>({
  name: componentName.rigidBody,
})

export const getRigidBody = crud.getComponent
export const createRigidBody = crud.createComponent
export const updateRigidBody = crud.updateComponent
export const removeRigidBody = crud.removeComponent
