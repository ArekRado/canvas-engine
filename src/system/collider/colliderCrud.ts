import { componentName } from '../../component/componentName'
import { Collider } from '../../type'
import { getComponentCrud } from '../../util/createComponentCrud'

const crud = getComponentCrud<Collider>({ name: componentName.animation })

export const getCollider = crud.getComponent
export const createCollider = crud.createComponent
export const updateCollider = crud.updateComponent
export const removeCollider = crud.updateComponent
