import { componentName } from '../../component/componentName'
import { Keyboard } from '../../type'
import { createComponentCrud } from '../../util/createComponentCrud'

const crud = createComponentCrud<Keyboard>({ name: componentName.keyboard })

export const getKeyboard = crud.getComponent
export const createKeyboard = crud.createComponent
export const updateKeyboard = crud.updateComponent
export const removeKeyboard = crud.removeComponent
