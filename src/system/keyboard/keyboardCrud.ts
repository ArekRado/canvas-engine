import { componentName } from '../../component/componentName'
import { Keyboard } from '../../type'
import { getComponentCrud } from '../../util/createComponentCrud'

const crud = getComponentCrud<Keyboard>({ name: componentName.keyboard })

export const getKeyboard = crud.getComponent
export const createKeyboard = crud.createComponent
export const updateKeyboard = crud.updateComponent
export const removeKeyboard = crud.removeComponent
