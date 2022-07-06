import { componentName } from '../../component/componentName'
import { Collider } from '../../type'
import { createComponentCrud } from '../../util/createComponentCrud'

const crud = createComponentCrud<Collider>({ name: componentName.collider })

export const getCollider = crud.getComponent
export const createCollider = crud.createComponent
export const updateCollider = crud.updateComponent
export const removeCollider = crud.removeComponent
