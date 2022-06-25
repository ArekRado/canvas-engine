import { componentName } from '../../component/componentName'
import { RigidBody } from '../../type'
import { getComponentCrud } from '../../util/createComponentCrud'

const crud = getComponentCrud<RigidBody>({
  name: componentName.animation,
})

export const getRigidBody = crud.getComponent
export const createRigidBody = crud.createComponent
export const updateRigidBody = crud.updateComponent
export const removeRigidBody = crud.updateComponent
