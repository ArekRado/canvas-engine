import { componentName } from '../../component/componentName'
import { Mouse } from '../../type'
import { createComponentCrud } from '../../util/createComponentCrud'

const crud = createComponentCrud<Mouse>({ name: componentName.mouse })

export const getMouse = crud.getComponent
export const createMouse = crud.createComponent
export const updateMouse = crud.updateComponent
export const removeMouse = crud.removeComponent
