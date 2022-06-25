import { componentName } from '../../component/componentName'
import { Animation } from '../../type'
import { getComponentCrud } from '../../util/createComponentCrud'

const crud = getComponentCrud<Animation>({ name: componentName.animation })

export const getAnimation = crud.getComponent
export const createAnimation = crud.createComponent
export const updateAnimation = crud.updateComponent
export const removeAnimation = crud.updateComponent
