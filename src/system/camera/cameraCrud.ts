import { componentName } from '../../component/componentName'
import { Camera } from '../../type'
import { getComponentCrud } from '../../util/createComponentCrud'

const crud = getComponentCrud<Camera>({ name: componentName.camera })

export const getCamera = crud.getComponent
export const createCamera = crud.createComponent
export const updateCamera = crud.updateComponent
export const removeCamera = crud.removeComponent
