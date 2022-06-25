import { componentName } from '../../component/componentName'
import { Mouse } from '../../type'
import { getComponentCrud } from '../../util/createComponentCrud'

const crud = getComponentCrud<Mouse>({ name: componentName.animation })

export const getMouse = crud.getComponent
export const createMouse = crud.createComponent
export const updateMouse = crud.updateComponent
export const removeMouse = crud.updateComponent
